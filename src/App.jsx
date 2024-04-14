import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Form, Button, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PriceFeed from './artifacts/contracts/PriceFeed.sol/PriceFeed.json'

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const [item, setItem] = useState({ pairs: '' }); 

  const { pairs } = item;

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

  const ABI = PriceFeed.abi;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, ABI, provider);

  const pairToFeedId = {
    'BTC/USD': 1,
    'ETH/USD': 2,
    'LINK/USD': 3,
    'BTC/ETH': 4
  };

  const getPair = async () => {
    try {
      const signer = provider.getSigner();  // This gets the signer from the user's wallet
      const contractWithSigner = contract.connect(signer);  // Connect the signer to the contract
  
      // Get the feed ID based on the selected pair and call updatePrice to set the latest price
      const feedId = pairToFeedId[pairs];  
      await contractWithSigner.updatePrice(feedId);  
      console.log('feedid is ' + feedId);
  
      //retrieve the latest price
      const price = await contract.getLatestFetchedPrice(feedId); 
      setStoredPrice('$' + parseInt(price) / 100000000);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };
  

  const handleChange = (e) => {
    console.log(e.target.value);
    setStoredPrice('');
    setItem((prevState) => ({
      ...prevState,
      pairs: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected pair is: ${pairs}`);
  };

  return (
    <div className='container'>
      <Image
        src='https://seeklogo.com/images/C/chainlink-logo-B072B6B9FE-seeklogo.com.png'
        width={200}
        height={200}
        fluid
        className='mt-5'
      />
      <hr />
      <Card 
        style={{ width: '32rem' }} 
        className='mt-5 shadow bg-body rounded'>
        <Card.Header as='h5'>Conversion Pair</Card.Header>
        <Card.Body>
          {''}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='pairs'>
              <Form.Check
                value='BTC/USD'
                type='radio'
                aria-label='radio 1'
                label='BTC/USD'
                onChange={handleChange}
                checked={pairs === 'BTC/USD'}
              />
              <Form.Check
                value='ETH/USD'
                type='radio'
                aria-label='radio 2'
                label='ETH/USD'
                onChange={handleChange}
                checked={pairs === 'ETH/USD'}
              />
              <Form.Check
                value='LINK/USD'
                type='radio'
                aria-label='radio 3'
                label='LINK/USD'
                onChange={handleChange}
                checked={pairs === 'LINK/USD'}
              />
              <Form.Check
                value='BTC/ETH'
                type='radio'
                aria-label='radio 4'
                label='BTC/ETH'
                onChange={handleChange}
                checked={pairs === 'BTC/ETH'}
              />
            </Form.Group>
            <Button variant='outline-primary' size='sm' type='submit' onClick={getPair}>
              Get Answer From Price Oracle
            </Button>
          </Form>
          <div className='mt-5'>
            <Card style={{ width: '32rem' }} className='mt-5 shadow bg-body rounded'>
              <Card.Header as='h5'>Result</Card.Header>
              <Card.Body>
                <div className='col'>
                  <h5>{pairs}: {storedPrice}</h5>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;
