import { useEffect, useState } from "react";
import axios, { Axios } from "axios";

export default function useBookSearch(query, pageNumber) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [books, setBooks] = useState([]);
	const [numFound, setNumFound] = useState(null);
	console.log("books", books);
	console.log("state books length", books.length);

	const [hasMore, setHasMore] = useState(false);
	console.log("hasMore", hasMore);
	const [lengthBooks, setLengthBooks] = useState(0);
	console.log("lengthBooks", lengthBooks);

	useEffect(() => {
		setBooks([]);
	}, [query]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		console.log("cancel token", cancel);
		axios({
			method: "GET",
			url: "http://openlibrary.org/search.json",
			params: { q: query, page: pageNumber },
			cancelToken: new axios.CancelToken((c) => (cancel = c))
		})
			.then((res) => {
				setBooks((prevBooks) => {
					return [
						...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)])
					];
				});
				console.log("res", res);
				console.log("res.res.data.docs", res.data.docs);

				setHasMore(res.data.docs.length > 0);
				setLengthBooks(res.data.docs.length);
				setNumFound(res.data.q !== "" ? res.data.numFound : null);
				setLoading(false);
			})
			.catch((err) => {
				if (axios.isCancel(err)) return;
				setError(true);
			});
		return () => cancel();
	}, [query, pageNumber]);

	return { loading, error, books, hasMore, numFound };
}
