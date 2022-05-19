import express from 'express'
import { createUser, deleteUser, getUser, getUsers, homepage, loginUser, updateUser, resetpassword} from '../Controller/user.controller'
import { Verify } from '../Middleware/verify'
import { Allow } from '../Middleware/Allow'
const router=express.Router()


router.post('/create', createUser)
router.get('/login', loginUser)
router.get('/', getUsers)
router.get('/home', Verify, homepage)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id',deleteUser)
router.patch('/:id', resetpassword)




export default router