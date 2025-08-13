// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  console.log('getUserInfo云函数开始执行，openid:', openid)
  
  try {
    // 查询数据库中是否已存在该openid的用户记录
    const userQuery = await db.collection('User').where({
      openid: openid
    }).get()
    
    console.log('用户查询结果:', userQuery.data.length, '条记录')
    
    let existingUser = null
    let isNewUser = true
    
    if (userQuery.data.length > 0) {
      // 用户已存在
      existingUser = userQuery.data[0]
      isNewUser = false
      console.log('用户已存在，用户信息:', existingUser)
    } else {
      console.log('新用户，需要注册')
    }
    
    const result = {
      openid: openid,
      existingUser: existingUser,
      isNewUser: isNewUser
    }
    
    console.log('getUserInfo云函数返回结果:', JSON.stringify(result, null, 2))
    
    return result
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      error: error.message,
      openid: openid,
      existingUser: null,
      isNewUser: true
    }
  }
}