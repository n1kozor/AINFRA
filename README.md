# AINFRA Project

![image](https://github.com/user-attachments/assets/0f42a280-ae3f-46ab-aae0-1e41db65d9dd)


## Getting Started

### Prerequisites
- Git installed on your system
- Docker and Docker Compose installed on your system
- OpenAI API key ( Optional for LLM service )

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

## Configuration

### LLM Service Setup

Currently, the LLM service only works with OpenAI. During the first startup, you'll need to configure the service:

1. Enter your OpenAI API key in the settings section
2. The system will retrieve the available models that you can access with your API key
3. Select which model you would like to use from the list of available models

## Usage

After configuration, you can interact with the system through the provided interface. The selected model will be used for all language processing tasks.

## Notes

- Make sure your OpenAI API key has the necessary permissions to access the models you wish to use
- Internet connectivity is required for the service to communicate with OpenAI's API

## Support

For issues or questions, please file an issue on the GitHub repository at https://github.com/n1kozor/AINFRA.
