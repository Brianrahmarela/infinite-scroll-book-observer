import "./App.css";
import { useState, useRef, useCallback } from "react";

import useBookSearch from "./useBookSearch";

function App() {
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	console.log("pageNumber", pageNumber);
	const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);
	console.log("books di app js", books);

	const observer = useRef();
	console.log("observer", observer);
	const lastBookElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					console.log("You has scrolled to last books item");
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			//check jika last element ada
			if (node) observer.current.observe(node);
			console.log("node lastbook", node);
		},
		[loading, hasMore]
	);

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				// justifyContent: "center",
				height: "100vh",
				flexDirection: "column",
				marginTop: "100px",
				backgroundColor: "white",
				padding: "20px",
			}}
		>
			<input type="text" value={query} onChange={handleSearch}></input>
			{books.map((book, index) => {
				//check last books element
				if (books.length === index + 1) {
					return (
						<div ref={lastBookElementRef} key={book}>
							{book}
						</div>
					);
				} else {
					return <div key={book}>{book}</div>;
				}
			})}
			<div>{loading && "Loading..."}</div>
			<div>{error && "Error"}</div>
		</div>
	);
}

export default App;
