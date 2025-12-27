import React from 'react';

const ErrorDisplay = ({ error }) => (
	<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-center">
		{error}
	</div>
);

export default ErrorDisplay;
