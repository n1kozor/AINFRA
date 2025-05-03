# AINFRA Project - MCP Monitoring

![Screenshot 2025-05-03 215632](https://github.com/user-attachments/assets/f97528a3-4da0-4074-bb79-79ae40eb8dc4)


## Introduction

AINFRA is a monitoring project that has reached its alpha version.

## Getting Started

### Prerequisites
- Git installed on your system
- Docker and Docker Compose installed on your system
- OpenAI API key (Required for LLM service)
- For standard devices: Glances running on target systems

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/n1kozor/AINFRA.git
   cd AINFRA
   ```

2. Build and start the Docker containers:
   ```bash
   docker build
   docker-compose up -d
   ```

3. For standard devices (Windows, Linux, Mac), install Glances ON THE TARGET DEVICE:
   ```bash
   docker run -d --restart="always" -p 61208-61209:61208-61209 -e GLANCES_OPT="-w" \
   -v /var/run/docker.sock:/var/run/docker.sock:ro \
   -v /run/user/1000/podman/podman.sock:/run/user/1000/podman/podman.sock:ro \
   --pid host nicolargo/glances:latest
   ```

## Configuration

### LLM Service Setup

Currently, the LLM service only works with OpenAI. During the first startup, you'll need to configure the service:

1. Enter your OpenAI API key in the settings section
2. The system will retrieve the available models that you can access with your API key
3. Select which model you would like to use from the list of available models

### Device Types

#### Standard Devices (Windows, Linux, Mac)
- Requires Glances to be running
- All statistics are transferred to the MCP server
- LLM can be used to query any system information

#### Custom Devices
- Create custom plugins to add any networked device
- Successfully tested with: ESXi, TVs, lab equipment, Synology NAS, Proxmox, Fritz!Box routers
- Supports both querying and controlling devices
- LLM can understand and execute operations defined in plugins

## Usage

- **Device Management**: Add and monitor devices on the Devices page
- **Chat Interface**: Communicate with your devices through the chat interface
- **Dashboard**: Click on the floating "soul" icon to generate network summaries
- **Sensors**: Create RAM and CPU monitors (currently for standard devices only)

## Known Issues

- New devices require 30-50 seconds before becoming available due to connectivity checks
- Auto-refresh functionality needs improvement; manual page refreshes often required
- Plugins can only be added in JSON format
- Device filtering is not yet implemented
- Ollama integration is still in development

## Planned Features

- Additional sensor types (processes monitoring, etc.)
- Sensor support for custom devices
- Custom agent for standard devices
- Enhanced dynamic interface for plugin-based devices
