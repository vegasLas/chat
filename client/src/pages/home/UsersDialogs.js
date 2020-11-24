import React, { Fragment, useEffect, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { GET_MESSAGES } from './queries'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useMessageState, useMessageDispatch } from '../../context/message'
import { SEND_MESSAGE } from './mutation'
import Dialog from './Dialog'

const UsersDialogs = () => {
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onCompleted: () => {
            setContent('')
        },
        onError: (err) => console.log(err)
    })
    const [content, setContent] = useState('')
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    let selectedUser
    selectedUser = users?.find(u => u.selected === true)
    const messages = selectedUser?.messages
    const [getMessages, { loading: messagesLoadnig, data: messagesData }] = useLazyQuery(GET_MESSAGES)
    useEffect(() => {
        if (selectedUser && !messages) {
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser])
    useEffect(() => {
        if (messagesData) {
            dispatch({
                type: 'SET_USER_MESSAGES',
                payload: { username: selectedUser.username, messages: messagesData.getMessages }
            })
        }
    }, [messagesData])
    let selectedChatMarkup
    function submitMessage(e) {
        e.preventDefault()
        if (content.trim() === '') return
        sendMessage({
            variables: {
                to: selectedUser.username,
                content
            }
        })
    }
    if (!messages && !messagesLoadnig) {
        selectedChatMarkup = <p className='info-text'>Select user</p>
    } else if (messagesLoadnig) {
        selectedChatMarkup = <p className='info-text'>Loading...</p>
    } else if (messages.length > 1) {
        selectedChatMarkup = messages.map(m => (
            <Fragment key={m.uuid}>
                <Dialog reactions={m.reactions} uuid={m.uuid} createdAt={m.createdAt} from={m.from} content={m.content} />
            </Fragment>
        ))
    } else if (messages.length === 0) {
        selectedChatMarkup = <p className='info-text'>You are now connected! Send your first message </p>
    }
    return (
        <Col xs={10} md={8} class className='p-0'>
            <div className='messages-box d-flex flex-column-reverse p-3'>
                {selectedChatMarkup}
            </div>
            {selectedUser && <div className='px-3 px-2'>
                <Form onSubmit={submitMessage}>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            type='text'
                            className='message-input p-4 rounded-pill bg-secondary'
                            placeholder='Type message'
                            onSubmit={submitMessage}
                            value={content}
                            onChange={e => setContent(e.target.value)}>
                        </Form.Control>
                        <i
                            className="fas fa-paper-plane fa-2x text-primary ml-2"
                            onClick={submitMessage}
                            role="button"
                        ></i>
                    </Form.Group>
                </Form>
            </div>}
        </Col>
    )
}
export default UsersDialogs