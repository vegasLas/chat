import gql from "graphql-tag";

export const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage{
            uuid
            from
            to
            content
            createdAt
        }
    }
`
export const NEW_REACTION = gql`
    subscription newReaction {
        newReaction{
            uuid
            content
            message{uuid from to}
        }
    }
`