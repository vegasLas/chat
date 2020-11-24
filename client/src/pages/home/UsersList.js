import { Image, Col } from "react-bootstrap";
import cn from "classnames";
import { useMessageState, useMessageDispatch } from '../../context/message'
import { GET_USERS } from "./queries";
import { useQuery } from "@apollo/client";

const UsersList = () => {
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: "SET_USERS", payload: data.getUsers }),
        onError: err => console.log(err)
    })
    let usersMarkup;
    if (!users || loading) {
        usersMarkup = <p>Loading</p>
    }
    else if (users.length === 0) {
        usersMarkup = <p>No users have joined</p>
    } else if (users.length > 0) {
        usersMarkup = users.map(u => {
            let selected
            if (u.selected) selected = true
            return (
                <div
                    role="button"
                    className={cn("user-div d-flex p-3 justify-content-center justify-content-md-start", { 'bg-white': selected })}
                    key={u.username}
                    onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: u.username })}>
                    <Image
                        className='user-image'
                        src={u.imageUrl ? u.imageUrl : 'https://bizraise.pro/wp-content/uploads/2014/09/no-avatar-300x300.png'} />
                    <div className='d-none d-md-block ml-2'>
                        <p className=' text-success '>{u.username}</p>
                        <p className=' font-weight-light '>{u.latestMessage ? u.latestMessage.content : 'You are now connected!'}</p>
                    </div>
                </div>)
        })
    }
    return (
        <Col xs={2} md={4} className="p-0 bg-secondary" >
            {usersMarkup}
        </Col>
    )
}
export default UsersList