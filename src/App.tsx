import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Students from './page/students/students'
import Home from './page/home/home';
import ProjLayout from './layout';
import StudentDetailComponent from './page/students/student-form/detail';
import HomeFormComponent from './page/home/home-form/detail';

function App() {
  return (
    <div className="App">
      <Router>
        <ProjLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classroom/detail/:classroomid" element={<HomeFormComponent />} />
            <Route path="/classroom/edit/:classroomid" element={<HomeFormComponent />} />
            <Route path="/classroom/create" element={<HomeFormComponent />} />

            <Route path="/students" element={<Students />} />
            <Route path="/students/detail/:studentid" element={<StudentDetailComponent />} />
            <Route path="/students/edit/:studentid" element={<StudentDetailComponent />} />
            <Route path="/students/create" element={<StudentDetailComponent />} />
          </Routes>
        </ProjLayout>
      </Router>
    </div>
  );
}

export default App;
