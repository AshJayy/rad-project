
export const SuccessCard = () => {
    return (
        <div className="max-w-sm mx-auto my-8 p-6 text-center border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
            <p className="mb-6">Thank you for your payment. Your transaction has been completed successfully.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Go to Dashboard
            </button>
        </div>
    );
};
