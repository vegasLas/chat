import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
    query login(
        $username: String!
        $password: String!
        ) 
        {
        login(
        username: $username
        password: $password)
        {
            username
            email
            token
            createdAt
        }
    }
`
const Login = (props) => {
    const { onChange, onSubmit, values } = useForm(() => loginUser(), {
        username: '',
        password: '',
    })
    const dispatch = useAuthDispatch()
    const [errors, setErrors] = useState({})
    const [loginUser, { loading }] = useLazyQuery(
        LOGIN_USER,
        {
            onCompleted(data) {
                dispatch({ type: 'LOGIN', payload: data.login })
                window.location.href = '/'
            },
            onError(err) {
                console.log(err.graphQLErrors[0].extensions.errors)
                setErrors(err.graphQLErrors[0].extensions.errors)
            },
            variables: values
        }
    )
    return (
        <Container className="pt-5">
            <Row className="bg-white py-5 justify-content-center">
                <Col sm={8} md={6} lg={4}>
                    <h1 className="text-center">Login</h1>
                    <Form onSubmit={onSubmit} className={loading ? 'loading' : ''}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label className={errors.username && 'text-danger'}>
                                {errors.username ?? 'Username'}
                            </Form.Label>
                            <Form.Control className={errors.username && "is-invalid"} name="username" value={values.username} onChange={onChange} type="text" placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className={errors.password && 'text-danger'}>
                                {errors.password ?? 'Password'}
                            </Form.Label>
                            <Form.Control className={errors.password && "is-invalid"} name="password" value={values.password} onChange={onChange} type="password" placeholder="Enter password" />
                        </Form.Group>
                        <Button disabled={loading} type="submit" >
                            {loading ? 'loading' : 'Login'}
                        </Button><br />
                        <small>Don't hane an account? <Link to='/register'>Register</Link></small>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default Login