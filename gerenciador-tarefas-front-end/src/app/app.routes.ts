
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { PostTaskComponent } from './admin/components/post-task/post-task.component';
import { UpdateTaskComponent } from './admin/components/update-task/update-task.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    {
        path: "funcionario/dashboard", loadComponent: () =>
            import("./funcionario/components/dashboard/dashboard.component").then(m => m.DashboardComponent)
    },


    {
        // agrupamento de rotas com base no admin, ex "admin/criar-tarefa"
        path: "admin",
        children: [
            {
                path: "dashboard",
                loadComponent: () => import("./admin/components/dashboard/dashboard.component").then(m => m.DashboardComponent)
            },
            { path: "criar-tarefa", component: PostTaskComponent },
            { path: "task/:id/edit", component: UpdateTaskComponent },
        ]
    }
];
