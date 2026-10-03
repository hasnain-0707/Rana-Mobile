import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminDashboard from './AdminDashboard.jsx';

const emptyOtp = ['', '', '', ''];

export default function AdminAuth() {
  const [session, setSession] = useState({ loading: true, admin: null });
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(emptyOtp);
  const [debugOtp, setDebugOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setSession({ loading: false, admin: data.admin }))
      .catch(() => setSession({ loading: false, admin: null }));
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const startLogin = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true); setDebugOtp('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setOtp(emptyOtp);
      setResendIn(60);
      setStep('otp');
      if (data.debugOtp) {
        setDebugOtp(data.debugOtp);
        setNotice(`Verification code: ${data.debugOtp}`);
      } else {
        setNotice(data.message || 'Verification code sent to your email.');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to start login. Please check email and password.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event) => {
    if (event) event.preventDefault();
    const code = otp.join('');
    if (!/^\d{4}$/.test(code)) { setError('Enter the complete 4-digit code.'); return; }
    setError(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: code });
      if (data.token) {
        localStorage.setItem('rana_admin_token', data.token);
      }
      setSession({ loading: false, admin: data.admin });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0 || busy) return;
    setError(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      setOtp(emptyOtp);
      setResendIn(60);
      if (data.debugOtp) {
        setDebugOtp(data.debugOtp);
        setNotice(`A new verification code was generated: ${data.debugOtp}`);
      } else {
        setNotice(data.message || 'A new verification code was sent.');
      }
      inputs.current[0]?.focus();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to resend OTP.');
    } finally {
      setBusy(false);
    }
  };

  const updateOtp = (index, value) => {
    const next = [...otp]; next[index] = value.replace(/\D/g, '').slice(0, 1); setOtp(next);
    if (next[index] && index < 3) inputs.current[index + 1]?.focus();
  };

  const autofillCode = (codeStr) => {
    if (!codeStr || codeStr.length !== 4) return;
    const digits = codeStr.split('');
    setOtp(digits);
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('rana_admin_token');
    setSession({ loading: false, admin: null });
    setStep('credentials');
    setPassword('');
    setOtp(emptyOtp);
    setDebugOtp('');
    setError('');
    setNotice('');
  };

  if (session.loading) return <main className="admin-login"><div className="auth-loading"><div className="spinner-border text-light" /></div></main>;
  if (session.admin) return <AdminDashboard onLogout={logout} />;

  return (
    <main className="admin-login">
      <div className="login-card">
        <Link to="/" className="auth-brand"><span className="brand-mark brand-logo">RM</span> Rana <b>Mobile</b></Link>
        {step === 'credentials' ? (
          <form onSubmit={startLogin}>
            <div className="eyebrow">Rana Mobile administration</div>
            <h1>Welcome back</h1>
            <p>Sign in to manage your products, brands, and stock.</p>
            <label>
              Admin email address
              <input
                className="form-control"
                type="text"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ranasadiq758567@gmail.com"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Account password
              <div className="password-field">
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </label>
            <button className="btn btn-primary w-100" disabled={busy}>
              {busy ? 'Signing in...' : 'Continue to admin panel'} <i className="bi bi-arrow-right" />
            </button>
          </form>
        ) : (
          <form onSubmit={verify}>
            <button type="button" className="auth-back" onClick={() => { setStep('credentials'); setError(''); setNotice(''); setDebugOtp(''); }}>
              <i className="bi bi-arrow-left" /> Change email
            </button>
            <div className="eyebrow">Two-step verification</div>
            <h1>Verify your identity</h1>
            <p>Enter the 4-digit verification code sent to <strong>{email}</strong>.</p>
            {debugOtp && (
              <div className="alert alert-info py-2 px-3 mb-3 text-center rounded-3">
                <small className="d-block fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Verification Code</small>
                <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                  <span className="fs-3 fw-bold text-primary" style={{ letterSpacing: '4px' }}>{debugOtp}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary py-0 px-2 ms-2"
                    onClick={() => autofillCode(debugOtp)}
                    title="Fill code into inputs"
                  >
                    Auto-fill
                  </button>
                </div>
              </div>
            )}
            <label>
              Verification code
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { inputs.current[index] = element; }}
                    value={digit}
                    inputMode="numeric"
                    maxLength="1"
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && !digit && index > 0) inputs.current[index - 1]?.focus();
                    }}
                    aria-label={`OTP digit ${index + 1}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </label>
            <button className="btn btn-primary w-100" disabled={busy}>
              {busy ? 'Verifying...' : 'Verify and continue'} <i className="bi bi-check2" />
            </button>
            <button type="button" className="btn btn-link w-100" disabled={busy || resendIn > 0} onClick={resend}>
              {resendIn > 0 ? `Send new code in ${resendIn}s` : 'Send a new code'}
            </button>
          </form>
        )}
        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </main>
  );
}
