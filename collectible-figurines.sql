--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id bigint NOT NULL,
    action character varying(512),
    user_id bigint NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(512)
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: chat_message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_message (
    id bigint NOT NULL,
    sender_id bigint NOT NULL,
    recipient_id bigint NOT NULL,
    content character varying(1024),
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    seen boolean DEFAULT false,
    trade_id bigint
);


ALTER TABLE public.chat_message OWNER TO postgres;

--
-- Name: fandoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fandoms (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    image_url character varying(512)
);


ALTER TABLE public.fandoms OWNER TO postgres;

--
-- Name: figurines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.figurines (
    id bigint NOT NULL,
    name character varying(128) NOT NULL,
    series character varying(128) NOT NULL,
    image_url character varying(512) NOT NULL,
    hover_image_url character varying(512) NOT NULL,
    chase boolean,
    glow_in_dark boolean,
    flocked boolean,
    exclusive boolean,
    fandom_id bigint,
    number bigint
);


ALTER TABLE public.figurines OWNER TO postgres;

--
-- Name: friendships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friendships (
    id bigint NOT NULL,
    user_id_1 bigint NOT NULL,
    user_id_2 bigint NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.friendships OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    sender_id bigint,
    recipient_id bigint NOT NULL,
    type character varying(512) NOT NULL,
    seen boolean DEFAULT false,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: seq_id_activity_logs; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_activity_logs
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_activity_logs OWNER TO postgres;

--
-- Name: seq_id_activity_logs; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_activity_logs OWNED BY public.activity_logs.id;


--
-- Name: seq_id_chat_message; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_chat_message
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_chat_message OWNER TO postgres;

--
-- Name: seq_id_chat_message; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_chat_message OWNED BY public.chat_message.id;


--
-- Name: seq_id_fandoms; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_fandoms
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_fandoms OWNER TO postgres;

--
-- Name: seq_id_fandoms; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_fandoms OWNED BY public.fandoms.id;


--
-- Name: seq_id_figurines; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_figurines
    START WITH 12
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_figurines OWNER TO postgres;

--
-- Name: seq_id_figurines; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_figurines OWNED BY public.figurines.id;


--
-- Name: seq_id_friendships; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_friendships
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_friendships OWNER TO postgres;

--
-- Name: seq_id_friendships; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_friendships OWNED BY public.friendships.id;


--
-- Name: seq_id_notifications; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_notifications
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_notifications OWNER TO postgres;

--
-- Name: seq_id_notifications; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_notifications OWNED BY public.notifications.id;


--
-- Name: trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trade (
    id bigint NOT NULL,
    initiator_id bigint NOT NULL,
    recipient_id bigint NOT NULL,
    status character varying(64)
);


ALTER TABLE public.trade OWNER TO postgres;

--
-- Name: seq_id_trade; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_trade
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_trade OWNER TO postgres;

--
-- Name: seq_id_trade; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_trade OWNED BY public.trade.id;


--
-- Name: trade_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trade_item (
    id bigint NOT NULL,
    trade_id bigint NOT NULL,
    figure_id bigint NOT NULL,
    owner_id bigint NOT NULL
);


ALTER TABLE public.trade_item OWNER TO postgres;

--
-- Name: seq_id_trade_item; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_trade_item
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_trade_item OWNER TO postgres;

--
-- Name: seq_id_trade_item; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_trade_item OWNED BY public.trade_item.id;


--
-- Name: user_figurine_list_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_figurine_list_items (
    id bigint NOT NULL,
    list_id bigint NOT NULL,
    figurine_id bigint NOT NULL,
    date date
);


ALTER TABLE public.user_figurine_list_items OWNER TO postgres;

--
-- Name: seq_id_user_figurine_list_items; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_user_figurine_list_items
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_user_figurine_list_items OWNER TO postgres;

--
-- Name: seq_id_user_figurine_list_items; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_user_figurine_list_items OWNED BY public.user_figurine_list_items.id;


--
-- Name: user_figurine_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_figurine_lists (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(128),
    type character varying(64) NOT NULL
);


ALTER TABLE public.user_figurine_lists OWNER TO postgres;

--
-- Name: seq_id_user_figurine_lists; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_user_figurine_lists
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_user_figurine_lists OWNER TO postgres;

--
-- Name: seq_id_user_figurine_lists; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_user_figurine_lists OWNED BY public.user_figurine_lists.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(128) NOT NULL,
    username character varying(128) NOT NULL,
    passwd character varying(256) NOT NULL,
    permission character varying(128) DEFAULT USER NOT NULL,
    last_login timestamp with time zone,
    avatar_url character varying(512)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: seq_id_users; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_id_users
    START WITH 4
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_id_users OWNER TO postgres;

--
-- Name: seq_id_users; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seq_id_users OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.seq_id_activity_logs'::regclass);


--
-- Name: chat_message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message ALTER COLUMN id SET DEFAULT nextval('public.seq_id_chat_message'::regclass);


--
-- Name: fandoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fandoms ALTER COLUMN id SET DEFAULT nextval('public.seq_id_fandoms'::regclass);


--
-- Name: figurines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.figurines ALTER COLUMN id SET DEFAULT nextval('public.seq_id_figurines'::regclass);


--
-- Name: friendships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships ALTER COLUMN id SET DEFAULT nextval('public.seq_id_friendships'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.seq_id_notifications'::regclass);


--
-- Name: trade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade ALTER COLUMN id SET DEFAULT nextval('public.seq_id_trade'::regclass);


--
-- Name: trade_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_item ALTER COLUMN id SET DEFAULT nextval('public.seq_id_trade_item'::regclass);


--
-- Name: user_figurine_list_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_figurine_list_items ALTER COLUMN id SET DEFAULT nextval('public.seq_id_user_figurine_list_items'::regclass);


--
-- Name: user_figurine_lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_figurine_lists ALTER COLUMN id SET DEFAULT nextval('public.seq_id_user_figurine_lists'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.seq_id_users'::regclass);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: chat_message chat_message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT chat_message_pkey PRIMARY KEY (id);


--
-- Name: fandoms fandoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fandoms
    ADD CONSTRAINT fandoms_pkey PRIMARY KEY (id);


--
-- Name: figurines figurines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.figurines
    ADD CONSTRAINT figurines_pkey PRIMARY KEY (id);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- Name: friendships friendships_user_id_1_user_id_2_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_user_id_1_user_id_2_key UNIQUE (user_id_1, user_id_2);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: trade_item trade_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_item
    ADD CONSTRAINT trade_item_pkey PRIMARY KEY (id);


--
-- Name: trade trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT trade_pkey PRIMARY KEY (id);


--
-- Name: user_figurine_list_items user_figurine_list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_figurine_list_items
    ADD CONSTRAINT user_figurine_list_items_pkey PRIMARY KEY (id);


--
-- Name: user_figurine_lists user_game_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_figurine_lists
    ADD CONSTRAINT user_game_lists_pkey PRIMARY KEY (id);


--
-- Name: friendships user_order; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.friendships
    ADD CONSTRAINT user_order CHECK ((user_id_1 < user_id_2)) NOT VALID;


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: figurines fandom_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.figurines
    ADD CONSTRAINT fandom_id FOREIGN KEY (fandom_id) REFERENCES public.fandoms(id) NOT VALID;


--
-- Name: trade_item figure_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_item
    ADD CONSTRAINT figure_id FOREIGN KEY (figure_id) REFERENCES public.figurines(id);


--
-- Name: trade initiator_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT initiator_id FOREIGN KEY (initiator_id) REFERENCES public.users(id);


--
-- Name: trade_item owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_item
    ADD CONSTRAINT owner_id FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: notifications recipient_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT recipient_id FOREIGN KEY (recipient_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: chat_message recipient_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT recipient_id FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: trade recipient_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT recipient_id FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: notifications sender_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT sender_id FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: chat_message sender_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT sender_id FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: chat_message trade_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT trade_id FOREIGN KEY (trade_id) REFERENCES public.trade(id) NOT VALID;


--
-- Name: trade_item trade_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_item
    ADD CONSTRAINT trade_id FOREIGN KEY (trade_id) REFERENCES public.trade(id) NOT VALID;


--
-- Name: activity_logs user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "user" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: friendships user1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT user1 FOREIGN KEY (user_id_1) REFERENCES public.users(id);


--
-- Name: friendships user2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT user2 FOREIGN KEY (user_id_2) REFERENCES public.users(id);


--
-- Name: user_figurine_lists user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_figurine_lists
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

