import React, { Fragment, useEffect, } from 'react'
import { Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthDispatch, useAuthState } from '../../context/auth'
import { useMessageDispatch } from '../../context/message'
import ListUsers from './UsersList'
import UsersDialogs from './UsersDialogs'
import { useSubscription } from '@apollo/client'
import { NEW_MESSAGE, NEW_REACTION } from './subscriptions'

const Home = React.memo(() => {
    const messageDispatch = useMessageDispatch()
    const { user } = useAuthState()
    const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE)
    const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION)
    useEffect(() => {
        if (messageError) console.log(messageError)
        if (messageData) {
            const message = messageData.newMessage
            const otherUser = user.username === message.to ? message.from : message.to
            messageDispatch({
                type: 'ADD_MESSAGE',
                payload: {
                    username: otherUser,
                    message
                }
            })
        }
    }, [messageError, messageData])
    useEffect(() => {
        if (reactionError) console.log(reactionError)
        if (reactionData) {
            const reaction = reactionData.newReaction
            const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to
            messageDispatch({
                type: 'ADD_REACTION',
                payload: {
                    username: otherUser,
                    reaction
                }
            })
        }
    }, [reactionData, reactionError])
    const logoutDis = useAuthDispatch()
    const logout = () => {
        logoutDis({ type: "LOGOUT" })
        window.location.href = './login'
    }
    return (
        <Fragment>
            <Row className="bg-white justify-content-around mb-1">
                <Button variant='link' onClick={logout}>
                    Logout
                </Button>
            </Row>
            <Row className='bg-white'>
                <ListUsers />
                <UsersDialogs />
            </Row>
        </Fragment>
    )
})
export default Home