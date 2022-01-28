const fs = require('fs/promises')
const path = require('path');
const { v4 } = require('uuid')

const contactsPath = path.join(__dirname, "./contacts.json")
console.log(__dirname)

async function listContacts() {
  const contacts = await fs.readFile(contactsPath)
  const data = JSON.parse(contacts)
  return data
}

async function getContactById(contactId) {
  const contacts = await listContacts()
  const result = contacts.find(item => item.id === contactId)
  return !result ? null : result
}

async function removeContact(contactId) {
  const contacts = await listContacts()
  const idx = contacts.findIndex(item => item.id === contactId)
  if (idx === -1) {
    return null
  }
  const deleteContact = contacts[idx]
  contacts.splice(idx, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return deleteContact
}

async function addContact(name, email, phone, id) {
  const data = { name, email, phone, id: v4() }
  const contacts = await listContacts()
  contacts.push(data)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return data
}

async function updateContact(contactId, name, email, phone) {
  const contacts = await listContacts()
  const idx = contacts.findIndex(item => item.id === contactId)
  if (idx === -1) {
    return null
  }
  contacts[idx] = { contactId, name, email, phone }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
