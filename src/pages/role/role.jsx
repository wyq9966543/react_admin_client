import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRole, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'

class Role extends Component {
    
    state = {
        loading: false, // 是否正在获取数据中
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }
    
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    
    initColumn = () => {
        this.columns = [
            {
                title: '角色名',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                //render: (create_time) => formateDate(create_time)
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }
    
    addRole = () => {
        this.form.validateFields(async (error,values)=>{
            if(!error) {
                this.setState({
                    isShowAdd: false
                })
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if (result.status===0){
                    message.success('添加角色成功')
                    
                    const role = result.data
                    
                    // 更新roles状态: 基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                }else {
                    message.success('添加角色失败')
                }
            }
        })
        
    }
    
    updateRole = async () => {
    
        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })
        
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        
        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status===0) {
            // this.getRoles()
            // 如果当前更新的是自己角色的权限, 强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success('当前用户角色权限已修改')
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }
    
    getRoles = async () => {
        
        // 在发请求前, 显示loading
        this.setState({loading: true})
        const result = await reqRole()
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if (result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    
    onRow = (role) => {
        return{
            onClick: event => {
                //alert(`选中${role.name}`)
                this.setState({
                    role
                })
            }
        }
    }
    
    componentWillMount() {
        this.initColumn()
    }
    
    componentDidMount() {
        this.getRoles()
    }
    
    render() {
        const {roles, role, isShowAdd, isShowAuth, loading} = this.state
        const  title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    loading={loading}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
    
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
    
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {logout}
)(Role)