import React, { useState } from 'react';
import { httpClient } from "../../constants/Api";
import { AUTH } from '../../constants/AppConstants';
import { Modal, Container, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';
import SpinnerLoader from './SpinnerLoader';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

function GenerateOtpModal({ show, onHide, mode }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: request OTP, 2: verify and change/reset
    const [loading, setLoading] = useState(false);
    // Separate states for each password field visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                email,
                mode
            }
            const response = await httpClient.post(AUTH.SEND_OTP, payload);
            if (response.status === 200) {
                toast.success(response.data.message || 'OTP sent successfully');
                setStep(2);
            }
        } catch (error) {
            const rawMessage = error.response?.data?.message || 'Failed to send OTP';
            const cleanMessage = rawMessage.replace(/^Error:\s*/g, '');  // removes all 'Error: ' prefixes
            toast.error(cleanMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = mode === 'forgot'
                ? AUTH.RESET_PASSWORD
                : AUTH.CHANGE_PASSWORD;

            const payload = mode === 'forgot'
                ? { email, otp, newPassword }
                : { email, otp, currentPassword, newPassword };

            const response = await httpClient.post(endpoint, payload);
            if (response.status === 200) {
                toast.success(response.data.message ||
                    (mode === 'forgot' ? 'Password reset successfully' : 'Password changed successfully'));
                onHide(); // Close modal on success
                // Reset form
                setEmail('');
                setOtp('');
                setCurrentPassword('');
                setNewPassword('');
                setStep(1);
            }

        } catch (error) {
            const rawMessage = error.response?.data?.message ||
                (mode === 'forgot' ? 'Failed to reset password' : 'Failed to change password');
            const cleanMessage = rawMessage.replace(/^Error:\s*/g, '');  // removes all 'Error: ' prefixes
            toast.error(cleanMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setEmail('');
        setOtp('');
        setCurrentPassword('');
        setNewPassword('');
        setStep(1);
        onHide();
    }

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(prev => !prev);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(prev => !prev);
    };

    return (
        <Container>
            <Modal
                show={show}
                onHide={onHide}
                centered
                backdrop="static"  // This prevents closing when clicking outside
                keyboard={false}   // This prevents closing with ESC key
            >
                <Modal.Header>
                    <Modal.Title>
                        {step === 1
                            ? 'Request For OTP'
                            : mode === 'forgot'
                                ? 'Reset Password'
                                : 'Change Password'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {step === 1 ? (
                        <Form onSubmit={handleSendOTP} autoComplete="off">
                            {/* fake input to stop autofilling password field */}
                            <input
                                type="password"
                                name="fake-password"
                                autoComplete="new-password"
                                style={{ display: 'none' }}
                            />
                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    required
                                    autoComplete="off"
                                    isInvalid={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid email address.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    ) : (
                        step == 2 && mode === "forgot" ?
                            (
                                <Form onSubmit={handlePasswordAction}>
                                    <p className="mb-3">OTP sent to {email}</p>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            value={otp}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                // Only allow 6-digit non-negative numbers
                                                if (/^\d{0,6}$/.test(input)) {
                                                    setOtp(input);
                                                }
                                            }}
                                            placeholder="Enter OTP"
                                            required
                                            autoComplete="off"
                                            isInvalid={otp && otp.length !== 6}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            OTP must be a 6-digit number.
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <div className='d-flex align-items-center password-input'>
                                            <Form.Control
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                                autoComplete="new-password"
                                            />
                                            <div
                                                onClick={toggleNewPasswordVisibility}>{showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Form>
                            ) :
                            (
                                <Form onSubmit={handlePasswordAction}>
                                    <p className="mb-3">OTP sent to {email}</p>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            value={otp}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                // Only allow 6-digit non-negative numbers
                                                if (/^\d{0,6}$/.test(input)) {
                                                    setOtp(input);
                                                }
                                            }}
                                            placeholder="Enter OTP"
                                            required
                                            isInvalid={otp && otp.length !== 6}
                                            autoComplete="off"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            OTP must be a 6-digit number.
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    <Form.Group className="mb-3">
                                        <Form.Label>Current Password</Form.Label>
                                        <div className='d-flex align-items-center password-input'>
                                            <Form.Control
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Enter current password"
                                                required
                                                autoComplete="new-password"
                                            />
                                            <div onClick={toggleCurrentPasswordVisibility}>{showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                            </div>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <div className='d-flex align-items-center password-input'>
                                            <Form.Control
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                                autoComplete="new-password"
                                            />
                                            <div onClick={toggleNewPasswordVisibility}>{showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Form>
                            )
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
                        Cancel
                    </Button>

                    {step === 1 ? (
                        <Button
                            style={{ width: "120px" }}
                            variant="primary"
                            onClick={handleSendOTP}
                            disabled={loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        >
                            {/* {loading ? 'Sending...' : 'Send OTP'} */}
                            {loading ? (
                                <SpinnerLoader loaderText="Sending..." />
                            ) : 'Send OTP'}
                        </Button>

                    ) : (

                        <Button
                            variant="primary"
                            onClick={handlePasswordAction}
                            disabled={
                                loading || !otp ||
                                otp.length !== 6 ||
                                !/^\d{6}$/.test(otp) ||
                                !newPassword
                            }
                        >
                            {loading
                                // ? (mode === 'forgot' ? 'Resetting...' : 'Changing...')
                                ? (mode === 'forgot' ?
                                    <SpinnerLoader loaderText="Resetting..." />
                                    :
                                    <SpinnerLoader loaderText="Changing..." />
                                )
                                : (mode === 'forgot' ? 'Reset Password' : 'Change Password')}
                        </Button>

                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default GenerateOtpModal;
