import React, {useState, useRef, useEffect} from 'react';
import LoginForm from "./LoginForm";
import {connect} from "react-redux";


const LoginButton = (props) => {
    let [showForm, setShowForm] = useState(false);
    const divRef = useRef();
    const toggle = e => {
        e.preventDefault();
        setShowForm(!showForm);
    };
    const handleClick = e => {
        if (!divRef.current.contains(e.target)) {  // click outside of the div
            setShowForm(false);
        }
    };
    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);
    let className = ' ' + (showForm?"":"hidden");
    let txt = props.auth.user?"Garage Logout":"Garage Login";
    return <div className="osv-login-button-wrapper" ref={divRef}>
        <button className="osv-login-button btn btn-primary" onClick={toggle}>{txt}</button>
        <div className={className}>
            <div className="osv-login-button-form">
                <LoginForm />
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, {})(LoginButton);
