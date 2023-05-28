# Use a base image with your preferred programming language and framework
FROM python:3.8

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code into the container
COPY . .

# Expose port 6000
EXPOSE 6000

# Set the command to run your application
CMD ["python", "app.py"]
