import "./App.css";
import { useState, useRef, useCallback } from "react";

import useBookSearch from "./useBookSearch";

function App() {
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	console.log("pageNumber", pageNumber);
	const { books, hasMore, loading, error, numFound } = useBookSearch(
		query,
		pageNumber
	);
	console.log("books di app js", books);
	console.log("numFound di app js", numFound);
	console.log("books.length", books.length);

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
			// console.log("node lastbook", node);
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
				flexDirection: "column",
				margin: "100px 20px 20px 20px",
				padding: "20px",
				backgroundColor: "white",

				borderRadius: "20px"
			}}
			className="shadow"
		>
			<label style={{ fontWeight: "bold", fontSize: "22px" }}>
				Search Books
			</label>
			<input
				type="text"
				value={query}
				onChange={handleSearch}
				placeholder="Search books here.."
				style={{ margin: "20px 0 20px 0", padding: "7px 14px 7px 14px" }}
			></input>
			<div
				style={{
					display: `${books.length === 0 ? "none" : "flex"}`,
					justifyContent: "center",
					width: "100%",
					gap: "10px",
					flexWrap: "wrap",
					marginTop: "100px",
					// backgroundColor: "green",
					margin: "20px"
				}}
			>
				{books.map((book, index) => {
					//check last books element
					if (books.length === index + 1) {
						return (
							<div
								style={{
									backgroundColor: "red",
									color: "white",
									padding: "10px",
									marginBottom: "5px",
									borderRadius: "10px"
								}}
								ref={lastBookElementRef}
								key={book}
							>
								{book}
							</div>
						);
					} else {
						return (
							<div
								style={{
									backgroundColor: "#efefef",
									padding: "10px",
									marginBottom: "5px",
									borderRadius: "10px"
								}}
								ref={lastBookElementRef}
								key={book}
							>
								{book}s
							</div>
						);
					}
				})}
			</div>
			<div
				style={{
					backgroundColor: "black",
					color: "white"
					// boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
				}}
			>
				{loading && "Loading..."}
			</div>
			{numFound === 0 && !loading ? <div>Books not found</div> : ""}
			{/* <div>{error && "Error"}</div> */}
		</div>
	);
}

export default App;
