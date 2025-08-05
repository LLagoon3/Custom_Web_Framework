import React, { useState } from 'react';
import { Navigation, Information, HugFrame } from "../components/Frame";
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputBox from '../components/InputBox';
const baseURL = import.meta.env.VITE_BE_BASE_URL;



const Register : React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const navigateToLogin = () => {
    navigate('/login');
  };

  const fetchRegister  = async () => {
    await fetch(`${baseURL}/login?email=${email}&password=${password}&name=${name}`, {
        method: "GET"
    });
  }

  return (
    <>
      <Navigation title="HELLO, WEB!">
          <Button text="로그인/회원가입" size="small" onClick={navigateToLogin} />
      </Navigation>
      <Information title="회원가입" />
      <HugFrame>
          <InputBox label="이메일" type="email" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputBox label="닉네임" type="text" placeholder="닉네임을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
          <InputBox label="비밀번호" type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
      </HugFrame>
      <HugFrame>
          <Button text="회원가입" size="large" onClick={fetchRegister} />
      </HugFrame>
    </>
  )
}

export default Register;