import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
        ) 
        {
        register(
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword) {
            username
            email
            token
            createdAt
        }
    }
`
const Register = (props) => {
    const { onChange, onSubmit, values } = useForm(() => registerUser(), {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const [registerUser, { loading }] = useMutation(
        REGISTER_USER,
        {
            update(_, res) {
                console.log(res)
                props.history.push('/')

            },
            onError(err) {
                console.log(err.graphQLErrors[0].extensions.errors)
                setErrors(err.graphQLErrors[0].extensions.errors)
            },
            variables: values
        }

    )
    return (

        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">Register</h1>
                <Form onSubmit={onSubmit} className={loading ? 'loading' : ''}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label className={errors.username && 'text-danger'}>
                            {errors.username ?? 'Username'}
                        </Form.Label>
                        <Form.Control className={errors.username && "is-invalid"} name="username" value={values.username} onChange={onChange} type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className={errors.email && 'text-danger'}>
                            {errors.email ?? 'Email'}
                        </Form.Label>
                        <Form.Control className={errors.email && "is-invalid"} name="email" value={values.email} onChange={onChange} type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className={errors.password && 'text-danger'}>
                            {errors.password ?? 'Password'}
                        </Form.Label>
                        <Form.Control className={errors.userpasswordname && "is-invalid"} name="password" value={values.password} onChange={onChange} type="password" placeholder="Enter password" />
                    </Form.Group>
                    <Form.Group controlId="formBasicConfirmPassword">
                        <Form.Label className={errors.confirmPassword && 'text-danger'}>
                            {errors.confirmPassword ?? 'Confirm password'}
                        </Form.Label>
                        <Form.Control className={errors.confirmPassword && "is-invalid"} name="confirmPassword" value={values.confirmPassword} onChange={onChange} type="password" placeholder="Repeat password" />
                    </Form.Group>
                    <Button disabled={loading} type="submit" >
                        {loading ? 'loading' : 'Register'}
                    </Button>
                    <br />
                    <small>Already have an account? <Link to='/login'>Login</Link></small>
                </Form>
            </Col>
        </Row>

    )
}
export default Register