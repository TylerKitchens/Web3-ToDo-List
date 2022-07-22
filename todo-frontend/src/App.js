import logo from './logo.svg';
import './App.css';
import { Container, Row, Col, Form, Button, Spinner, ListGroup } from 'react-bootstrap'
import { ethers } from "ethers";
import abi from './utils/ToDo'
import { useEffect, useState } from 'react';
import { messagePrefix } from '@ethersproject/hash';

function App() {

  const CONTRACT_ADDRESS = '0xC199D4dDe673E801ef631daF8f963CA35c1707ef'
  const contractABI = abi.abi

  const [task, setTask] = useState('')
  const [taskList, setTaskList] = useState([])
  const [account, setAccount] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let toDoContract;

    getTasks()

    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();

      toDoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      toDoContract.on("NewTask", _onNewTask)
    }

    return () => {
      if (toDoContract) {
        toDoContract.off("NewTask", _onNewTask)
      }
    }
  }, [])

  const _onNewTask = (from, timestamp, task, isDone) => {
    setTaskList(prev => [
      ...prev,
      {
        timestamp: new Date(timestamp * 1000),
        task,
        isDone
      }
    ])

  }

  const _isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const _connectWallet = async () => {
    console.log('connecting wallet')
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

    } catch (error) {
      console.log(error);
    }
  }

  const _addTask = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const { ethereum } = window

      if (!(await _isWalletConnected())) {

        console.log('Please add MetaMask Chrome Extension')
        await _connectWallet()
      }

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const toDoContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        console.log("Adding task")
        const addTaskTxn = await toDoContract.addTask(task)


        await addTaskTxn.wait();

        console.log("mined ", addTaskTxn.hash);

        console.log("Task Added purchased!");

        // Clear the form fields.
        setTask('')
      }
    } catch (e) {
      console.log(e)
    }

    setLoading(false)

  }

  const getTasks = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const toDoContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        const tasks = await toDoContract.getTasks()
        console.log(tasks)
        setTaskList(tasks)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="App">
      <Container className='p-3 text-center'>
        <Row className='justify-content-center'>
          <Col md={6} className='mt-5 shadow rounded border p-4'>
            <h1>Welcome to ToDo Web3</h1>
            <Form onSubmit={_addTask} className='p-3'>
              <Form.Group className='text-start'>
                <Form.Label className='text-start'>Task Name</Form.Label>
                <Form.Control placeholder='Enter Task...' type='text' value={task} onChange={e => setTask(e.target.value)} />
              </Form.Group>

              <Button disabled={loading} type='submit' variant='primary' className='mt-2' >Add Task</Button>
            </Form>

            {loading && <Spinner animation='border' className='my-2' />}

          </Col>
        </Row>

        <Row className='justify-content-center'>
          <Col md={6} className='mt-5 shadow rounded border p-4'>
            <h2>Task List</h2>
            <ListGroup>

              {taskList?.map(task => <ListGroup.Item>{task.task}</ListGroup.Item>)}
            </ListGroup>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default App;
