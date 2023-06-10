import logging
import boto3
from botocore.exceptions import ClientError
import os
import grpc
import re
from concurrent import futures
import computeandstorage_pb2
import computeandstorage_pb2_grpc


class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    
    def __init__(self):
        session=boto3.Session(
        aws_access_key_id='ASIAXHW5UPVXHP3A2EH3',
        aws_secret_access_key='J+/Ites9tuqIhj39SYYAAvgCjSmiWERVXNsMCtUm',
        aws_session_token='FwoGZXIvYXdzEHYaDIVhZ+CiYXzKZzvXpyLAASkkqxs2yjZTrpO7MJniwrJGQ78+9mRUgoXhCE/iLoYyWYIyy5i1p840vJopO00cbQOVwVe8rXJD6IuvVKXynxxc2/TGQUhlu4u7qnWxDbOeEGhycBI3WmLAebv2PdXsoFI6H3qBYHt6SEIUv4wRfR8T38Hue4C9Rg17ayZESyXoX68+cQDaFzaHiL1e8dFBw0p8CqDMuPA05HGPVnydJB476Bj2Whku3zK8qPFxE9iGzIbD1MkZs7iqrqXq6KBiqSiLx5OkBjItN6Ox0SyqOUj7K+ZP2+WzjqXtvelQPO1qMRZwPdxGCkqpgGy/V6gn6mb5T5Mf'
        )
        self.s3_client = session.client('s3')
        self.bucket_name = 'test-bucket-b00928066'
        self.file_name = 'data.html'
        self.s3_client.upload_file(self.file_name, self.bucket_name, self.file_name)

    def StoreData(self, request, context):
        data=request.data
        self.s3_client.put_object(Body=data, Bucket=self.bucket_name, Key=self.file_name)
        s3_url = f'https://{self.bucket_name}.s3.amazonaws.com/{self.file_name}'

        return computeandstorage_pb2.StoreReply(s3uri=s3_url)
    

    def AppendData(self, request, context):
        response=self.s3_client.get_object(Bucket=self.bucket_name, Key=self.file_name)
        data = request.data
        file_data = response['Body'].read().decode()
        append_data=file_data+data
        self.s3_client.put_object(Body=append_data, Bucket=self.bucket_name, Key=self.file_name)
        return computeandstorage_pb2.AppendReply()
    
    def DeleteFile(self, request, context):
        s3_url = request.s3uri
        parts = s3_url.split('/')
        bucket_name = parts[2].split('.')[0]
        key = '/'.join(parts[3:])

        self.s3_client.delete_object(Bucket=bucket_name, Key=key)
        return computeandstorage_pb2.DeleteReply()


    def upload_file(file_name, bucket, object_name=None):

        if object_name is None:
            object_name = os.path.basename(file_name)

        s3_client = boto3.client('s3')
        try:
            s3_client.upload_file(file_name, bucket, object_name)
        except ClientError as e:
            logging.error(e)
            return False
        return True
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Server is running on port 50051")
    serve()
