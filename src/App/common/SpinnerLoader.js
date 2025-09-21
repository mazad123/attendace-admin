const SpinnerLoader = ({ loaderText }) => {
    return (
        <>
            <button
                className="btn btn-leave_status btn-2"
                disabled
            >
                <div
                    className="spinner-border text-light"
                    style={{ width: "1.3em", height: "1.3em" }}
                    role="status"
                >
                    {/* <span className="visually-hidden">Loading...</span> */}
                    <span className="visually-hidden">{loaderText}</span>
                </div>
            </button>
        </>
    )
}
export default SpinnerLoader;

// const SpinnerLoader = ({ loaderText }) => {
//     return (
//         <div className="d-flex align-items-center justify-content-center gap-2">
//             <div
//                 className="spinner-border text-light"
//                 style={{ width: "1.3em", height: "1.3em" }}
//                 role="status"
//             >
//                 <span className="visually-hidden">{loaderText}</span>
//             </div>
//             <span>{loaderText}</span>
//         </div>
//     );
// };

// export default SpinnerLoader;
