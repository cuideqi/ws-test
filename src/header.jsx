import React from 'react';
import { PageHeader } from 'react-bootstrap'

export function Header(props) {
    return (
        <PageHeader>{props.title ? props.title : 'Webscoket测试！'}<small>{props.author ? props.author: 'cdq'}</small></PageHeader>
    )
}