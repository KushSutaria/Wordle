# Use a base image with your preferred programming language and framework
FROM python:3.8

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .
RUN pip install --no-cache-dir -r requirements.txt


# Set the command to run your application
CMD ["python", "app.py"]