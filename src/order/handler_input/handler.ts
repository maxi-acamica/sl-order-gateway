import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';

const sqs = new SQS();

const input: APIGatewayProxyHandler = async (event, context) => {
  let statusCode: number = 200;
  let message: string;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body was found',
      }),
    };
  }

  const queueName: string = 'OrderQueue';

  const queueUrl: string = ``

  try {
    await sqs.sendMessage({
      QueueName: queueName,
      MessageBody: event.body,
    }).promise();

    message = 'order add to the Queue!';

  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

export default input;