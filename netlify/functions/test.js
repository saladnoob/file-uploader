exports.handler = async (event) => {
  console.log('Test function triggered');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Test function is working!' }),
  };
};
