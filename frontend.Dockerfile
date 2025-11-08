FROM node:22

# Set up environment variables
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install required dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    file \
    git \
    default-jdk \
    wget \
    unzip \
    curl \
    gnupg2 \
    adb

# Download and install Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip *tools*linux*.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm *tools*linux*.zip

# Accept licenses and install Android SDK packages
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" \
    "platforms;android-31" \
    "build-tools;31.0.0" \
    "ndk;21.4.7075529"

WORKDIR /app

# Create a temporary package.json if it doesn't exist
RUN echo '{"name":"fitbasic","version":"1.0.0"}' > /app/package.json

# Install React Native CLI globally
RUN npm install -g react-native-cli

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
