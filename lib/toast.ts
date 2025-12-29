import toast from 'react-hot-toast';

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);
export const showInfo = (message: string) => toast(message);

// Usage example:
// import { showSuccess, showError, showInfo } from '@/lib/toast';
// showSuccess('Operation successful!');
// showError('Something went wrong!');
// showInfo('This is an info message.');
