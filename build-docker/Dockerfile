FROM ubuntu:xenial

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    apt-transport-https \
    ca-certificates \
    unzip \
    zip \
    build-essential \
    software-properties-common \
    psmisc \
    linux-headers-virtual \
    curl \
    libssl-dev \
    libffi-dev \
    linux-headers-generic \
    wget \
    git
RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl -L https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN export LINUX_DISTR="$(lsb_release -c -s)" && \
    echo "deb https://download.virtualbox.org/virtualbox/debian $LINUX_DISTR contrib" | tee -a /etc/apt/sources.list.d/virtualbox.list && \
    curl -L https://www.virtualbox.org/download/oracle_vbox_2016.asc | apt-key add - && \
    curl -L https://www.virtualbox.org/download/oracle_vbox.asc | apt-key add -
RUN export LINUX_DISTR="$(lsb_release -c -s)" && \
    echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu $LINUX_DISTR stable" | tee -a /etc/apt/sources.list.d/docker.list && \
    curl -L https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    apt-key fingerprint 0EBFCD88
RUN export LINUX_DISTR="$(lsb_release -c -s)" && \
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $LINUX_DISTR main" | tee -a /etc/apt/sources.list.d/azure.list && \
    curl -L https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    apt-key adv --keyserver packages.microsoft.com --recv-keys 52E16F86FEE04B979B07E28DB02C46DF417A0893
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    virtualbox \
    virtualbox-ext-pack \
    docker-ce \
    qemu \
    qemu-kvm \
    virt-manager \
    virt-viewer \
    libvirt-bin \
    open-vm-tools \
    python-vm-builder-ec2 \
    azure-cli \
    dirmngr \
    google-cloud-sdk \
    nodejs \
    npm \
    ruby-full
RUN npm install -g yarn
RUN wget https://releases.hashicorp.com/packer/1.2.2/packer_1.2.2_linux_amd64.zip && \
    unzip packer_*.zip -d packer && \
    rm -rf packer_*.zip && \
    mv packer /usr/local && \
    echo 'export PATH="$PATH:/usr/local/packer"' >> /etc/environment && \
    export PATH="$PATH:/usr/local/packer" && \
    packer
