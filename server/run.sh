#!/bin/bash

# Microservices Management Script for Eatzilla

SERVICE_NAMES=("api" "alert" "delivery" "order" "payment" "restaurant")
SERVICE_PATHS=(
    "api-gateway"
    "alert"
    "delivery"
    "order"
    "payment"
    "restaurant"
)

# Define ports for each service
declare -A SERVICE_PORTS
SERVICE_PORTS=(
    ["api"]=3000
    ["alert"]=3001
    ["delivery"]=3002
    ["order"]=3003
    ["payment"]=3004
    ["restaurant"]=3005
)

COLORS=(
    '\033[0;31m'   # Red
    '\033[0;32m'   # Green
    '\033[0;33m'   # Yellow
    '\033[0;34m'   # Blue
    '\033[0;35m'   # Magenta
    '\033[0;36m'   # Cyan
    '\033[0;91m'   # Bright Red
    '\033[0;92m'   # Bright Green
    '\033[0;93m'   # Bright Yellow
    '\033[0;94m'   # Bright Blue
    '\033[0;95m'   # Bright Magenta
    '\033[0;96m'   # Bright Cyan
)
NC='\033[0m'

ICON_START="🚀"
ICON_STOP="🛑"
ICON_RUNNING="✅"
ICON_STOPPED="❌"
ICON_ERROR="⚠️"
ICON_RMQ="🐰"
ICON_STATUS="ℹ️"
ICON_RESTART="⚡️"
ICON_WAITING="⏳"

PIDS=()
RMQ_PID=""

# Timeout in seconds for service health checks
HEALTH_CHECK_TIMEOUT=60

# Fix permission issues by ensuring the dist directory is writable
fix_permissions() {
    local dist_dir="$(pwd)/dist"
    
    if [ -d "$dist_dir" ]; then
        echo -e "${COLORS[3]}${ICON_STATUS} Fixing permissions for dist directory...${NC}"
        # First try without sudo
        if ! chmod -R 755 "$dist_dir" 2>/dev/null; then
            # If that fails, try with sudo
            echo -e "${COLORS[3]}${ICON_STATUS} Requires elevated permissions, you may be prompted for password...${NC}"
            sudo chmod -R 755 "$dist_dir" || {
                echo -e "${COLORS[0]}${ICON_ERROR} Failed to fix permissions! Services may fail to start.${NC}"
                return 1
            }
        fi
        echo -e "${COLORS[2]}${ICON_RUNNING} Permissions fixed successfully.${NC}"
    fi
    return 0
}

# Maps a service name to its corresponding color.
get_service_color() {
    local service_name="$1"
    for i in "${!SERVICE_NAMES[@]}"; do
        if [[ "${SERVICE_NAMES[$i]}" == "$service_name" ]]; then
            echo "${COLORS[$((i % ${#COLORS[@]}))]}"
            return 0
        fi
    done
    echo "${COLORS[0]}"  # Fallback
}


# Maps a service name to its corresponding path.
# Returns the path if found, otherwise returns nothing.
get_service_path() {
    local service_name="$1"
    for i in "${!SERVICE_NAMES[@]}"; do
        if [[ "${SERVICE_NAMES[$i]}" == "$service_name" ]]; then
            echo "${SERVICE_PATHS[$i]}"
            return 0
        fi
    done
    return 1
}

# Check if a service is healthy by checking its port
check_service_health() {
    local service_name="$1"
    local timeout="${2:-$HEALTH_CHECK_TIMEOUT}"
    local port="${SERVICE_PORTS[$service_name]}"
    
    if [ -z "$port" ]; then
        echo -e "${COLORS[0]}${ICON_ERROR} No port defined for service '$service_name'${NC}"
        return 1
    fi
    
    local start_time=$(date +%s)
    local end_time=$((start_time + timeout))
    local service_color=$(get_service_color "$service_name")
    
    echo -e "${service_color}${ICON_WAITING} Waiting for $service_name to be ready (checking port $port, timeout ${timeout}s)...${NC}"
    
    while [ $(date +%s) -lt $end_time ]; do
        if nc -z localhost $port 2>/dev/null; then
            echo -e "${service_color}${ICON_RUNNING} Service $service_name is healthy and listening on port $port${NC}"
            return 0
        fi
        sleep 1
    done
    
    echo -e "${COLORS[0]}${ICON_ERROR} Service $service_name failed to start within ${timeout} seconds${NC}"
    return 1
}

# Checks if required dependencies are installed.
# Exits with an error message if any are missing.
check_dependencies() {
    local deps=("nest" "docker" "pkill" "nc")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo -e "${COLORS[0]}${ICON_ERROR} Dependency '$dep' not found!${NC}"
            if [ "$dep" = "nc" ]; then
                echo -e "${COLORS[0]}${ICON_ERROR} Please install netcat with: sudo apt-get install netcat${NC}"
            fi
            exit 1
        fi
    done
}

# Checks if a service is already running before starting.
# If found, returns an error message and exits.
check_already_running() {
    local service_name="$1"
    local service_path=$(get_service_path "$service_name")
    if pgrep -f "nest start $service_path -w" > /dev/null; then
        echo -e "${COLORS[0]}${ICON_ERROR} Error: Service '$service_name' is already running!${NC}"
        return 1
    fi
}

# Checks if a service is already stopped before stopping.
# If found, returns an error message and exits.
check_already_stopped() {
    local service_name="$1"
    local service_path=$(get_service_path "$service_name")
    if ! pgrep -f "nest start $service_path -w" > /dev/null; then
        echo -e "${COLORS[0]}${ICON_ERROR} Error: Service '$service_name' is already stopped!${NC}"
        return 1
    fi
}

# Clean the dist directory before starting service to avoid permission errors
clean_dist_for_service() {
    local service_path="$1"
    local dist_dir="$(pwd)/dist/apps/$service_path"
    
    if [ -d "$dist_dir" ]; then
        echo -e "${COLORS[3]}${ICON_STATUS} Cleaning dist directory for $service_path...${NC}"
        # First try without sudo
        if ! rm -rf "$dist_dir" 2>/dev/null; then
            # If that fails, try with sudo
            echo -e "${COLORS[3]}${ICON_STATUS} Requires elevated permissions, you may be prompted for password...${NC}"
            sudo rm -rf "$dist_dir" || {
                echo -e "${COLORS[0]}${ICON_ERROR} Failed to clean dist directory! Service may fail to start.${NC}"
                return 1
            }
        fi
    fi
    return 0
}

# Launches a single service using 'nest start'.
# Runs in the background with colored, prefixed logs.
# Optionally runs in detached mode if specified.
# Checks if the service exists and if it's already running.
start_service() {
    local service_name="$1"
    local detach_mode="${2:-false}"
    local check_health="${3:-true}"
    local service_path=$(get_service_path "$service_name")
    local service_color=$(get_service_color "$service_name")

    if ! check_already_running "$service_name"; then
        return 1
    fi
    
    if [ -z "$service_path" ]; then
        echo -e "${COLORS[0]}${ICON_ERROR} Error: Service '$service_name' not found!${NC}"
        return 1
    fi

    # Clean the dist directory for this service before starting
    clean_dist_for_service "$service_path"

    if [ "$detach_mode" = true ]; then
        echo -e "${service_color}${ICON_START} Starting service: $service_name (Detached Mode)${NC}"
        nest start "$service_path" -w > /dev/null 2>&1 &
        local pid=$!
        PIDS+=($pid)
        
        # Add a short sleep to give the service time to start
        sleep 2
        
        # Check if the process is still running
        if ! ps -p $pid > /dev/null; then
            echo -e "${COLORS[0]}${ICON_ERROR} Service $service_name failed to start!${NC}"
            return 1
        fi
        
        # Check service health if needed
        if [ "$check_health" = true ]; then
            check_service_health "$service_name"
        fi
    else
        echo -e "${service_color}${ICON_START} Starting service: $service_name${NC}"
        
        # Start in background but capture the PID
        nest start "$service_path" -w 2>&1 | while read -r line; do
            printf "${service_color}[%s]${NC} %s\n" "$service_name" "$line"
        done &
        local pid=$!
        PIDS+=($pid)
        
        # Add a short sleep to give the service time to start
        sleep 2
        
        # Check if the process is still running
        if ! ps -p $pid > /dev/null; then
            echo -e "${COLORS[0]}${ICON_ERROR} Service $service_name failed to start!${NC}"
            return 1
        fi
    fi
}

# Starts RabbitMQ in a Docker container on port 5672.
# Displays logs with a rabbit emoji prefix in the background.
# Optionally runs in detached mode if specified.
# Checks dependencies and if RabbitMQ is already running.
start_rmq() {
    check_dependencies

    if docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
        echo -e "${COLORS[0]}${ICON_ERROR} Error: RabbitMQ is already running!${NC}"
        return 1
    fi
    local detach_mode="${1:-false}"

    if [ "$detach_mode" = true ]; then
        echo -e "\033[1;37m${ICON_START} Starting RabbitMQ (Detached Mode)...${NC}"
        docker run -d --rm --name rabbitmq -p 5672:5672 rabbitmq:4.0-alpine > /dev/null 2>&1
        sleep 5
        if docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
            echo -e "\033[0;34m${ICON_RMQ} [RabbitMQ]${NC} RabbitMQ started in detached mode!"
        else
            echo -e "${COLORS[0]}${ICON_ERROR} Error: RabbitMQ failed to start!${NC}"
            return 1
        fi
    else
        echo -e "\033[1;37m${ICON_START} Starting RabbitMQ...(Use Ctrl+C to stop, -d for detached mode)${NC}"
        echo
        docker run --rm --name rabbitmq -p 5672:5672 rabbitmq:4.0-alpine 2>&1 | while read -r line; do
            printf "\033[0;34m${ICON_RMQ} [RabbitMQ]${NC} %s\n" "$line"
        done &
        RMQ_PID=$!
        sleep 5
        if docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
            echo
            echo -e "\033[0;34m${ICON_RMQ} [RabbitMQ]${NC} RabbitMQ started!"
        else
            echo
            echo -e "${COLORS[0]}${ICON_ERROR} Error: RabbitMQ failed to start!${NC}"
            return 1
        fi
    fi
}

# Stops the RabbitMQ Docker container. (if running)
# Checks if it's running before attempting to stop.
stop_rmq() {
    echo -e "\033[1;37m${ICON_STOP} Stopping RabbitMQ...${NC}"
    echo
    docker stop rabbitmq >/dev/null 2>&1 && { echo -e "\033[0;34m${ICON_RMQ} [RabbitMQ]${NC} RabbitMQ stopped!"; echo; } || { echo -e "${COLORS[0]}${ICON_ERROR} Error: RabbitMQ not running!${NC}"; echo; }
}

# Starts all defined services simultaneously.
# Calls start_service for each in the background.
start_parallel() {
    # Fix permissions before starting services
    fix_permissions
    
    echo -e "\033[1;37m${ICON_START} Starting all services in parallel...${NC}"
    echo
    
    # Start RabbitMQ first if it's not running
    if ! docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
        echo -e "\033[1;37m${ICON_START} Starting RabbitMQ first...${NC}"
        start_rmq true
    fi
    
    for service in "${SERVICE_NAMES[@]}"; do
        start_service "$service" false false
    done
    
    echo
    echo -e "${COLORS[2]}${ICON_WAITING} Checking service health...${NC}"
    
    # Check health of all services
    for service in "${SERVICE_NAMES[@]}"; do
        check_service_health "$service" 30 &
    done
    wait
    
    echo
    echo -e "${COLORS[2]}${ICON_RUNNING} Service startup complete${NC}"
    echo
}

# Terminates a single service quickly.
# Uses multiple parallel kills commands for efficiency.
stop_service() {
    local service_name="$1"
    local service_path=$(get_service_path "$service_name")
    local service_color=$(get_service_color "$service_name")
    
    if [ -z "$service_path" ]; then
        echo -e "${COLORS[0]}${ICON_ERROR} Error: Service '$service_name' not found!${NC}"
        echo
        return 1
    fi

    if ! check_already_stopped "$service_name"; then
        return 1
    fi

    {
        pkill -9 -f "nest start $service_path -w" &
        pkill -9 -f "node.*$service_path" &
        pkill -9 -f "nest.*$service_path" &
        wait
        
        pgrep -f "nest start $service_path -w" | xargs -r kill -9 &
        
        echo -e "${service_color}${ICON_STOP} Stopped service: $service_name${NC}"
    } 2>/dev/null
}

# Stops all services in parallel.
# Uses GNU Parallel if available, else falls back to background tasks.
stop_parallel() {
    echo -e "\033[1;37m${ICON_STOP} Stopping all services...${NC}"
    echo
    
    if command -v parallel &> /dev/null; then
        printf '%s\n' "${SERVICE_NAMES[@]}" | parallel -j0 "./$(basename "$0") stop {}"
    else
        for service in "${SERVICE_NAMES[@]}"; do
            stop_service "$service" &
        done
        wait
    fi
    
    sleep 0.5
    echo
}

# Displays the current status of all services and RabbitMQ.
# Shows running or stopped with appropriate icons.
status() {
    echo -e "${COLORS[2]}${ICON_STATUS} Service Status:${NC}"
    echo
    for service in "${SERVICE_NAMES[@]}"; do
        local service_path=$(get_service_path "$service")
        local service_color=$(get_service_color "$service")
        local port="${SERVICE_PORTS[$service]}"
        
        # Check process status
        if pgrep -f "nest start $service_path -w" > /dev/null; then
            # Check port status if port is defined
            if [ -n "$port" ] && nc -z localhost $port 2>/dev/null; then
                echo -e "${service_color}${ICON_RUNNING} $service: Running on port $port${NC}"
            else
                echo -e "${service_color}${ICON_WAITING} $service: Process running but port $port not responding${NC}"
            fi
        else
            echo -e "${COLORS[0]}${ICON_STOPPED} $service: Stopped${NC}"
        fi
    done
    
    echo
    echo -e "${COLORS[2]}${ICON_STATUS} RabbitMQ Status:${NC}"
    echo
    if docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
        if nc -z localhost 5672 2>/dev/null; then
            echo -e "\033[0;34m${ICON_RMQ} RabbitMQ: Running on port 5672${NC}"
        else
            echo -e "\033[0;34m${ICON_WAITING} RabbitMQ: Container running but port 5672 not responding${NC}"
        fi
    else
        echo -e "${COLORS[0]}${ICON_STOPPED} RabbitMQ: Stopped${NC}"
    fi
    echo
}

# Handles CTRL+C for RabbitMQ cleanup.
# Stops the container and kills its background process.
rmq_cleanup() {
    echo -e "\n\033[1;37m${ICON_STOP} CTRL+C detected! Stopping RabbitMQ...${NC}"
    echo
    if docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
        stop_rmq
    fi
    if [ -n "$RMQ_PID" ] && kill -0 "$RMQ_PID" 2>/dev/null; then
        kill -9 "$RMQ_PID" 2>/dev/null
    fi
    exit 0
}

# Handles CTRL+C for service cleanup.
# Stops all services and kills their background processes.
service_cleanup() {
    echo -e "\n\033[1;37m${ICON_STOP} CTRL+C detected! Stopping all services...${NC}"
    echo
    stop_parallel
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill -9 "$pid" 2>/dev/null
        fi
    done
    exit 0
}

if [ $# -eq 0 ]; then
    echo
    echo -e "${COLORS[3]}📝 Eatzilla Microservices Management Script${NC}"
    echo -e "${COLORS[2]}============================================${NC}"
    echo
    echo -e " ${COLORS[2]} 🕹️  Available Commands:${NC}"
    echo
    echo -e "  ${ICON_START} Individual Service Management:"
    echo -e "    ${COLORS[4]}./run.sh start [service_name]     ${NC} 🟢 Start a specific service"
    echo -e "    ${COLORS[4]}./run.sh start -d [service_name]  ${NC} 🔇 Start a service in detached mode"
    echo -e "    ${COLORS[4]}./run.sh stop [service_name]      ${NC} 🛑 Stop a specific service"
    echo -e "    ${COLORS[4]}./run.sh restart [service_name]   ${NC} 🔄 Restart a specific service"
    echo
    echo -e "  ${ICON_START} All Services Management:"
    echo -e "    ${COLORS[4]}./run.sh start-all               ${NC} 🚀 Start all services"
    echo -e "    ${COLORS[4]}./run.sh start-all -d            ${NC} 🔇 Start all services in detached mode"
    echo -e "    ${COLORS[4]}./run.sh stop-all                ${NC} 🛑 Stop all services"
    echo -e "    ${COLORS[4]}./run.sh restart-all             ${NC} 🔄 Restart all services"
    echo
    echo -e "  ${ICON_RMQ} RabbitMQ Management:"
    echo -e "    ${COLORS[4]}./run.sh rmq-start               ${NC} 🐰 Start RabbitMQ"
    echo -e "    ${COLORS[4]}./run.sh rmq-start -d            ${NC} 🔇 Start RabbitMQ in detached mode"
    echo -e "    ${COLORS[4]}./run.sh rmq-stop                ${NC} 🛑 Stop RabbitMQ"
    echo
    echo -e "  ${ICON_STATUS} Other Commands:"
    echo -e "    ${COLORS[4]}./run.sh status                  ${NC} ℹ️  Show service status"
    echo -e "    ${COLORS[4]}./run.sh fix-permissions         ${NC} 🔧 Fix dist directory permissions"
    echo
    echo -e "${COLORS[2]}Available Services:${NC}"
    
    # Dynamic service listing
    for i in "${!SERVICE_NAMES[@]}"; do
        echo -e "  ${COLORS[1]}🔹 ${SERVICE_NAMES[$i]} (${SERVICE_PATHS[$i]}) - Port ${SERVICE_PORTS[${SERVICE_NAMES[$i]}]}${NC}"
    done
    
    echo
    exit 1
fi

case "$1" in
    start)
        trap service_cleanup SIGINT
        check_dependencies
        if [[ "$2" == "-d" || "$2" == "--detach" ]]; then
            start_service "$3" true true
        else
            start_service "$2" false true
        fi
        wait
        ;;
    start-all)
        trap service_cleanup SIGINT
        check_dependencies
        if [[ "$2" == "-d" || "$2" == "--detach" ]]; then
            # Fix permissions first
            fix_permissions
            
            # Start RabbitMQ first if it's not running
            if ! docker ps -q | grep -q "$(docker ps -q -f name=rabbitmq)"; then
                echo -e "\033[1;37m${ICON_START} Starting RabbitMQ first...${NC}"
                start_rmq true
            fi
            
            for service in "${SERVICE_NAMES[@]}"; do
                start_service "$service" true false
            done
            
            echo
            echo -e "${COLORS[2]}${ICON_WAITING} Checking service health...${NC}"
            
            # Check health of all services
            for service in "${SERVICE_NAMES[@]}"; do
                check_service_health "$service" 30 &
            done
            wait
            
            echo
            echo -e "${COLORS[2]}${ICON_RUNNING} All services started in detached mode.${NC}"
        else
            start_parallel
            echo
            echo -e "${COLORS[2]}${ICON_RUNNING} All services started. Type 'rs' and press Enter to restart all services, or Ctrl+C to stop.${NC}"
            echo
            while read -r input; do
                if [ "$input" = "rs" ]; then
                    echo
                    echo -e "${COLORS[2]}${ICON_RESTART} Restart signal received. Restarting all services...${NC}"
                    echo
                    stop_parallel
                    start_parallel
                    echo
                    echo -e "${COLORS[2]}${ICON_RUNNING} All services restarted. Type 'rs' to restart again, or Ctrl+C to stop.${NC}"
                    echo
                elif [ "$input" = "status" ]; then
                    echo
                    status
                    echo -e "${COLORS[2]}${ICON_RUNNING} Type 'rs' to restart all services, or Ctrl+C to stop.${NC}"
                    echo
                else
                    echo
                    echo -e "${COLORS[0]}${ICON_ERROR} Unknown command: '$input'. Type 'rs' to restart all services, 'status' to check status.${NC}"
                    echo
                fi
            done
        fi
        ;;
    stop-all)
        stop_parallel
        ;;
    restart-all)
        trap service_cleanup SIGINT
        stop_parallel
        start_parallel
        ;;
    stop)
        stop_service "$2"
        ;;
    restart)
        trap service_cleanup SIGINT
        stop_service "$2"
        start_service "$2" false true
        wait
        ;;
    rmq-start)
        trap rmq_cleanup SIGINT
        check_dependencies
        if [[ "$2" == "-d" || "$2" == "--detach" ]]; then
            start_rmq true
        else
            start_rmq
        fi
        wait
        ;;
    rmq-stop)
        stop_rmq
        ;;
    status)
        check_dependencies
        status
        ;;
    fix-permissions)
        fix_permissions
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|fix-permissions} [service_name] or $0 {start-all|stop-all|restart-all|rmq-start|rmq-stop}"
        echo "Services: ${SERVICE_NAMES[*]}"
        exit 1
        ;;
esac

exit 0