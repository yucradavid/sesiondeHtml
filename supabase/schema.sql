create table if not exists public.classroom_control (
    id integer primary key check (id = 1),
    active boolean not null default false,
    session_id text not null default 'sesion1' check (session_id in ('sesion1', 'sesion2')),
    project_id text not null default 'all',
    updated_at timestamptz not null default now()
);

alter table public.classroom_control
    add column if not exists project_id text not null default 'all';

insert into public.classroom_control (id, active, session_id)
values (1, false, 'sesion1')
on conflict (id) do nothing;

create table if not exists public.students (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null check (char_length(name) between 1 and 60),
    avatar text not null check (char_length(avatar) <= 120),
    session_id text not null default 'sesion1' check (session_id in ('sesion1', 'sesion2')),
    progress jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table public.students drop constraint if exists students_avatar_check;
alter table public.students
    add constraint students_avatar_check check (char_length(avatar) <= 120);

create table if not exists public.help_requests (
    student_id uuid primary key references auth.users (id) on delete cascade,
    message text not null check (char_length(message) between 1 and 300),
    status text not null default 'pending' check (status in ('pending', 'answered')),
    teacher_message text check (teacher_message is null or char_length(teacher_message) <= 500),
    created_at timestamptz not null default now(),
    answered_at timestamptz
);

create table if not exists public.mission_completions (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null references public.students (id) on delete cascade,
    session_id text not null check (session_id in ('sesion1', 'sesion2')),
    project_id text not null check (char_length(project_id) between 1 and 80),
    mission_id text not null check (mission_id ~ '^m[1-9][0-9]*$'),
    completed_at timestamptz not null default now()
);

create unique index if not exists mission_completions_student_mission_idx
    on public.mission_completions (student_id, session_id, project_id, mission_id);
create index if not exists mission_completions_completed_at_idx
    on public.mission_completions (completed_at desc);

alter table public.classroom_control enable row level security;
alter table public.students enable row level security;
alter table public.help_requests enable row level security;
alter table public.mission_completions enable row level security;

drop policy if exists "Authenticated users can read classroom control" on public.classroom_control;
create policy "Authenticated users can read classroom control"
    on public.classroom_control for select to authenticated
    using (true);

drop policy if exists "Only teacher can control classroom" on public.classroom_control;
create policy "Only teacher can control classroom"
    on public.classroom_control for all to authenticated
    using ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com')
    with check ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com');

drop policy if exists "Students and teacher can read student profiles" on public.students;
create policy "Students and teacher can read student profiles"
    on public.students for select to authenticated
    using (
        (select auth.uid()) = id
        or (select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com'
    );

drop policy if exists "Students can create their own profile" on public.students;
create policy "Students can create their own profile"
    on public.students for insert to authenticated
    with check ((select auth.uid()) = id and (select auth.jwt() ->> 'is_anonymous') = 'true');

drop policy if exists "Students and teacher can update student profiles" on public.students;
create policy "Students and teacher can update student profiles"
    on public.students for update to authenticated
    using (
        (select auth.uid()) = id
        or (select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com'
    )
    with check (
        (select auth.uid()) = id
        or (select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com'
    );

drop policy if exists "Students and teacher can read help requests" on public.help_requests;
create policy "Students and teacher can read help requests"
    on public.help_requests for select to authenticated
    using (
        (select auth.uid()) = student_id
        or (select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com'
    );

drop policy if exists "Students can create their own help request" on public.help_requests;
create policy "Students can create their own help request"
    on public.help_requests for insert to authenticated
    with check (
        (select auth.uid()) = student_id
        and (select auth.jwt() ->> 'is_anonymous') = 'true'
        and status = 'pending'
        and teacher_message is null
    );

drop policy if exists "Students can update their own pending help request" on public.help_requests;
create policy "Students can update their own pending help request"
    on public.help_requests for update to authenticated
    using ((select auth.uid()) = student_id)
    with check (
        (select auth.uid()) = student_id
        and status = 'pending'
        and teacher_message is null
    );

drop policy if exists "Teacher can answer help requests" on public.help_requests;
create policy "Teacher can answer help requests"
    on public.help_requests for update to authenticated
    using ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com')
    with check ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com');

drop policy if exists "Teacher can close help requests" on public.help_requests;
create policy "Teacher can close help requests"
    on public.help_requests for delete to authenticated
    using ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com');

drop policy if exists "Students can record their own mission completions" on public.mission_completions;
create policy "Students can record their own mission completions"
    on public.mission_completions for insert to authenticated
    with check (
        (select auth.uid()) = student_id
        and (select auth.jwt() ->> 'is_anonymous') = 'true'
    );

drop policy if exists "Teacher can read mission completion history" on public.mission_completions;
create policy "Teacher can read mission completion history"
    on public.mission_completions for select to authenticated
    using ((select auth.jwt() ->> 'email') = 'davidrobertyucramamani@gmail.com');

grant select, insert, update on public.classroom_control to authenticated;
grant select, insert, update on public.students to authenticated;
grant select, insert, update, delete on public.help_requests to authenticated;
grant select, insert on public.mission_completions to authenticated;

do $$
begin
    alter publication supabase_realtime add table public.classroom_control;
exception
    when duplicate_object then null;
    when undefined_object then raise notice 'Enable Realtime publication in Supabase and add classroom_control.';
end
$$;

do $$
begin
    alter publication supabase_realtime add table public.students;
exception
    when duplicate_object then null;
    when undefined_object then raise notice 'Enable Realtime publication in Supabase and add students.';
end
$$;

do $$
begin
    alter publication supabase_realtime add table public.help_requests;
exception
    when duplicate_object then null;
    when undefined_object then raise notice 'Enable Realtime publication in Supabase and add help_requests.';
end
$$;

do $$
begin
    alter publication supabase_realtime add table public.mission_completions;
exception
    when duplicate_object then null;
    when undefined_object then raise notice 'Enable Realtime publication in Supabase and add mission_completions.';
end
$$;
