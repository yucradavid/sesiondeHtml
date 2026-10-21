create table if not exists public.classroom_control (
    id integer primary key check (id = 1),
    active boolean not null default false,
    session_id text not null default 'sesion1' check (session_id in ('sesion1', 'sesion2')),
    updated_at timestamptz not null default now()
);

insert into public.classroom_control (id, active, session_id)
values (1, false, 'sesion1')
on conflict (id) do nothing;

create table if not exists public.students (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null check (char_length(name) between 1 and 60),
    avatar text not null check (char_length(avatar) <= 8),
    session_id text not null default 'sesion1' check (session_id in ('sesion1', 'sesion2')),
    progress jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

create table if not exists public.help_requests (
    student_id uuid primary key references auth.users (id) on delete cascade,
    message text not null check (char_length(message) between 1 and 300),
    status text not null default 'pending' check (status in ('pending', 'answered')),
    teacher_message text check (teacher_message is null or char_length(teacher_message) <= 500),
    created_at timestamptz not null default now(),
    answered_at timestamptz
);

alter table public.classroom_control enable row level security;
alter table public.students enable row level security;
alter table public.help_requests enable row level security;

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

grant select, insert, update on public.classroom_control to authenticated;
grant select, insert, update on public.students to authenticated;
grant select, insert, update, delete on public.help_requests to authenticated;

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
