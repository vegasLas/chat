import React, { useState } from 'react'
import cn from 'classnames'
import { useAuthState } from '../../context/auth'
import { OverlayTrigger, Tooltip, Popover, Button } from 'react-bootstrap'
import moment from 'moment'
import { useMutation } from '@apollo/client'
import { REACT_TO_MESSAGE } from './mutation'
const reactionsSel = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
const Dialog = ({ createdAt, from, content, uuid, reactions }) => {
    const { user } = useAuthState()
    const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
        onCompleted: data => setShowPopover(false),
        onError: err => console.log(err)
    })
    const react = (reaction) => {
        console.log('go')
        reactToMessage({ variables: { uuid, content: reaction } })
    }
    const sent = user.username === from
    const [ShowPopover, setShowPopover] = useState(false)
    const reactButton = (
        <OverlayTrigger
            trigger='click'
            placement="top"
            show={ShowPopover}
            onToggle={setShowPopover}
            rootClose
            transition={false}
            overlay={
                <Popover className='rounded-pill'>
                    <Popover.Content className='d-flex px-0 py-1 align-items-center react-icon-popover'>
                        {reactionsSel.map(reaction => (
                            <Button
                                variant='link'
                                className="react-icon-button"
                                key={reaction}
                                onClick={() => react(reaction)}>
                                {reaction}
                            </Button>
                        ))}
                    </Popover.Content>
                </Popover>
            }>
            <Button variant='link' className='px-2'>
                <i className="far fa-smile"></i>
            </Button>
        </OverlayTrigger>)
    return (
        <div className={cn('d-flex my-3', {
            'mr-auto': !sent,
            'ml-auto': sent
        })}>
            {sent && reactButton}
            <OverlayTrigger
                placement={sent ? 'right' : 'left'}
                overlay={<Tooltip>
                    {moment(createdAt).format('MMMM DD, YYYY @ h:mm a')}
                </Tooltip>}>
                <div className={cn("py-2 px-3 rounded-pill position-relative", {
                    "bg-primary": sent,
                    "bg-secondary": !sent,
                })}>
                    {reactions.length > 0 && (
                        <div className={cn("bg-white p-1 rounded-pill", sent ? "reactions-sent" : "reactions-received")}>
                            {reactions.map(r => r.content)} {reactions.length}
                        </div>
                    )}
                    <p className={cn({ 'text-white': sent })}>
                        {content}
                    </p>
                </div>
            </OverlayTrigger>
            {!sent && reactButton}
        </div>


    )
}

export default Dialog