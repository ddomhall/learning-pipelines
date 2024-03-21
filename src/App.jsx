import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Person from './components/Person.jsx'
import personService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    personService.getAll().then(res => setPersons(res.data))
  },[])

  function changeName(e) {
    setNewName(e.target.value)
  }

  function changeNumber(e) {
    setNewNumber(e.target.value)
  }

  async function addName(e) {
    e.preventDefault()
    if (persons.filter(p => p.name === newName).length) {
      setErrorMessage('updating record')
      const person = persons.find(p => p.name === newName)
      setPersons(persons.map(p => p.id === person.id ? { ...person, number: newNumber } : p))
      await personService.update(person.id, { ...person, number: newNumber })
      setErrorMessage(
        'dome'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    } else {
      personService.create({ name: newName, number: newNumber })
        .then( res => {
          setPersons(persons.concat(res.data))
          setErrorMessage(
            'dome'
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
        .catch( err => {
          setErrorMessage(err.response.data.error)
        })

    }
  }

  async function handleDelete(id) {
    // eslint-disable-next-line
    if (window.confirm('are you sure')) {

      await personService.deletePerson(id)
        .catch(err => {
          setErrorMessage(err.message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })

      setErrorMessage(
        'dome'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    } setPersons(persons.filter(p => p.id !== id))
  }

  function filterList(e) {
    setFilter(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <p className='error'>{errorMessage}</p>
      <h2>add person</h2>
      <PersonForm addName={addName} newName={newName} changeName={changeName} newNumber={newNumber} changeNumber={changeNumber} />
      <h2>Numbers</h2>
      <Filter filter={filter} filterList={filterList} />
      {persons.length ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).map(p => <Person key={p.id} person={p} handleDelete={handleDelete}/>) : ''}
    </div>
  )
}

export default App
