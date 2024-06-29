import { serviceFunction } from "../helpers/service.function";

export const studentsService = {
    studentList,
    deleteStudent,
    getStudent,
    updateStudent,
    createStudent,
}

async function studentList(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const queryString = serviceFunction.generateQueryString(params);
    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/students/list?${queryString}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function deleteStudent(params: any) {
    const requestOptions = {
        method: 'DELETE',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/students/delete/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function getStudent(params: any) {
    const requestOptions = {
        method: 'GET',
        headers: serviceFunction.headersOption(),
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/students/detail/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function updateStudent(params: any) {
    const requestOptions = {
        method: 'PUT',
        headers: serviceFunction.headersOption(),
        body: JSON.stringify(params)
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/students/update/${params.id}`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}

async function createStudent(params: any) {
    const requestOptions = {
        method: 'POST',
        headers: serviceFunction.headersOption(),
        body: JSON.stringify(params)
    };

    const urlEnpoint = `${process.env.REACT_APP_API_URL}/api/students/create`;
    return fetch(urlEnpoint, requestOptions)
        .then(response => serviceFunction.handleResponse(response))
        .then(res => {
            return res;
        })
}