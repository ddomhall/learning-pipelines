const Person = ({ person, handleDelete }) => {
  return (
    <>
      <p>{person.name}</p>
      <p>{person.number}</p>
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </>
  )
}

export default Person
