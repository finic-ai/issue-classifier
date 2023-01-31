const { Configuration, OpenAIApi } = require("openai");

const getPrompt = (promptName, inquiry) => {
  switch (promptName) {
    case 'issue_classification':
      return `You are an employee at Home Depot tasked with classifying the type of issue a customer is reporting. If the issue does not apepar to be related to Home Depot or its products, say 'Unrelated' instead of making something up.
      
      You must choose from the following options:
      - Order Status
      - Shipping and Delivery
      - Products and Services
      - Pricing and Promos
      - Payments
      - Account
      - Returns
      - Policies and Legal
      - Corporate Information
      - Speak to a Human
  
      Question: Can I return orders online?
      Answer: Returns
      
      Question: When will my order arrive?
      Answer: Shipping and Delivery
      
      Question: Let me speak to someone
      Answer: Speak to a Human

      Question: I can't sign in to my account
      Answer: Account

      Question: I need to get a refund, my drill bit arrive broken
      Answer: Products and Services

      Question: Do you stock the ryobi cordless sander?
      Answer: Products and Services
      
      Question: ${inquiry}
      Answer:`
    case 'question_and_answer':
      return `You are a customer support agent for Home Depot.
  
      Question: Can I return orders online?
      Answer: Home Depot offers free and easy returns online, wherever you want.
      
      Question: When will my order arrive?
      Answer: Estimated delivery dates are provided for each item in the product information page. To check the status of your order online, please visit The Home Depot order status page. Enter your order confirmation number and email address in the space provided. You can also track your item by clicking on the tracking number in the Shipping Confirmation e-mail that is sent once your item ships.
      
      Question: Are there any delivery restrictions?
      Answer: Any states with delivery restrictions will be noted on each item’s product information page. For items eligible for delivery to Alaska and Hawaii, please allow an additional 2-5 business days. Additional remote surcharges may apply. We are not able to ship to international destinations, PO Boxes, APO/FPO/DPO addresses at this time.
      
      Question: ${inquiry}
      Answer:`
  }
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generateResponse(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const inquiry = req.body.inquiry || '';
  if (inquiry.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid inquiry",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(inquiry),
      temperature: 0.6,
    });
    console.log(completion.data)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(inquiry) {
  return getPrompt('issue_classification', inquiry);
}
