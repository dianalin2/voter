export default async function Page(req) {
    const { id } = req.params;

    return (
        <div className="VertCenter MainWidth">
            <h1>
                Results for this poll are not yet released. Stay tuned!
            </h1>
        </div>
    );
}
