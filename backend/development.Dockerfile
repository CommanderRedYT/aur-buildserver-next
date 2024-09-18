# Dockerfile for development backend container
FROM ghcr.io/commanderredyt/node:22.9.0-archlinux as build

# Set the working directory
WORKDIR /app

# Install dependencies
RUN pacman -Syu --noconfirm && pacman -S --noconfirm base-devel git

# make user able to run sudo without password
RUN echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
