const {prisma} = require('../../../DB/config') 

const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const userId = req.user.id
    const { name } = req.body


    if (!name) {
      return res.status(400).json({
        message: 'Nothing to update'
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name }
    })

    res.status(200).json({
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}



module.exports = {updateProfile}