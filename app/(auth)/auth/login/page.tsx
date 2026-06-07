
import LoginPageComponent from '@/components/pages/auth/LoginPageComponent';


export const metadata = {
    title: 'Login - My Shepherd',
    description: 'Login to your My Shepherd account',
}


const LoginPage = () => {
    return (
        <div>
            <LoginPageComponent />
        </div>
    );
};

export default LoginPage;