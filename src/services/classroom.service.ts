import { serviceFunction } from "../helpers/service.function";

export const classroomService = {
    classroomList,
    getClassroom,
    deleteClassroom,
    updateClassroom,
    createClassroom,
    getStudentInClassroom,
    getStudentNotInClassroom,
    removeStudentFromClassroom,
    addStudentToClassroom,
    getMaleStudentRawQuery,
}

async function classroomList(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const queryString = serviceFunction.generateQueryString(params);
    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/list?${queryString}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function deleteClassroom(params: any) {
    const requestOptions = {
        method: 'DELETE',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/delete/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function getClassroom(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/detail/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function updateClassroom(params: any) {
    const requestOptions = {
        method: 'PUT',
        headers: serviceFunction.headersOption(),
        body: JSON.stringify(params)
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/update/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function createClassroom(params: any) {
    const requestOptions = {
        method: 'POST',
        headers: serviceFunction.headersOption(),
        body: JSON.stringify(params)
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/create`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function getStudentInClassroom(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const queryString = serviceFunction.generateQueryString(params);
    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/students/${params.id}?${queryString}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function getStudentNotInClassroom(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const queryString = serviceFunction.generateQueryString(params);
    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/students-not-in-class?${queryString}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function addStudentToClassroom(params: any) {
    const requestOptions = {
        method: 'POST',
        headers: serviceFunction.headersOption(),
        body: JSON.stringify(params)
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/add-student`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function removeStudentFromClassroom(params: any) {
    const requestOptions = {
        method: 'DELETE',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/remove-student/${params.studentId}/${params.classroomId}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function getMaleStudentRawQuery() {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/classroom/get-male-student-raw-query`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}
