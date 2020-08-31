import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';

const sqs = new SQS();

const input: APIGatewayProxyHandler = async (event, context) => {
  let statusCode: number = 200;
  let message: string;

  // debgu Mode
  console.log(event, context);

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body was found',
      }),
    };
  }
  
  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const queueName: string = 'sl-order-gateway-'+process.env.STAGE+'-sqs';
  const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`
  

  try {
    await sqs.sendMessage({
      QueueUrl: queueUrl,
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

export default  input;