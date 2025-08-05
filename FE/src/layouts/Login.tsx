import React, { useState } from 'react';
import { Navigation, Information, HugFrame } from '../components/Frame';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputBox from '../components/InputBox';
const baseURL = import.meta.env.VITE_BE_BASE_URL;



const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const fetchLogin = async () => {
        await fetch(`${baseURL}/login?email=${email}&password=${password}`, {
            method: "GET"
        });
    }

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <>
            <Navigation title="HELLO, WEB!">
                <Button text="로그인/회원가입" size="small" onClick={navigateToRegister} />
            </Navigation>
            <Information title="로그인" />
            <HugFrame>
                <InputBox label="이메일" type="email" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputBox label="비밀번호" type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            </HugFrame>
            <HugFrame>
                <Button text="로그인" size="large" onClick= {fetchLogin}/>
                <span className='signup-info'>
                  아직 회원가입을 안하셨나요?
                  <a className="text-link" onClick={navigateToRegister}> 회원가입하기</a>
                </span>
            </HugFrame>
        </>
    );
};

export default Login;