const socket = io();
let connectionsFound = [];
let inConnection = [];

socket.on('admin_list_all_users', connections => {
    connectionsFound = connections;
    document.getElementById('list_users').innerHTML = '';

    let template = document.getElementById('template').innerHTML;

    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        });
        document.getElementById('list_users').innerHTML += rendered;
    });
});

function call(id){
    const connection = connectionsFound.find(connection => connection.socket_id === id);

    inConnection.push(connection);

    const template = document.getElementById('admin_template').innerHTML;

    const rendered = Mustache.render(template, {
        email: connection.email,
        id: connection.user_id
    });

    document.getElementById('supports').innerHTML += rendered;

    socket.emit('admin_user_in_support', {user_id: connection.user_id});

    socket.emit('admin_list_messages_by_user', {user_id: connection.user_id}, messages => {
        const divMessages = document.getElementById(`allMessages${connection.user_id}`);

        messages.forEach(message => {
            const createDiv = document.createElement('div');

            if(message.admin_id){
                createDiv.className = 'admin_message_admin';
                createDiv.innerHTML += `<span>Atendente - ${message.text}<span>`;
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}<span>`;
            }else{
                createDiv.className = 'admin_message_client';
                createDiv.innerHTML += `<span>${connection.user.email} - ${message.text}<span>`;
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}<span>`;
            }

            divMessages.appendChild(createDiv);
        });
    })
}

function sendMessage(id){
    const text = document.getElementById(`send_message_${id}`);

    socket.emit('admin_send_message', {text: text.value, user_id: id});

    const divMessages = document.getElementById(`allMessages${id}`);
    const createDiv = document.createElement('div')
    createDiv.className = 'admin_message_admin';
    createDiv.innerHTML += `<span>Atendente - ${text.value}<span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}<span>`;
    divMessages.appendChild(createDiv);

    text.value = '';
}

socket.on('admin_receive_message', message => {
    const { text, socket_id } = message;

    const connection = inConnection.find(connection => connection.socket_id === socket_id);

    const divMessages = document.getElementById(`allMessages${connection.user_id}`);

    const createDiv = document.createElement('div');
    createDiv.className = 'admin_message_client';
    createDiv.innerHTML += `<span>${connection.user.email} - ${text}<span>`;
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}<span>`;

    divMessages.appendChild(createDiv)
});