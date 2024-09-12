﻿// <auto-generated />
using System;
using Flexident.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Flexident.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240807184757_newFinalFinalMigr")]
    partial class newFinalFinalMigr
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Flexident.Data.Comentariu", b =>
                {
                    b.Property<int>("ComentariuId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ComentariuId"));

                    b.Property<DateTime>("DataComentariu")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("TextComentariu")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserUserId")
                        .HasColumnType("integer");

                    b.HasKey("ComentariuId");

                    b.HasIndex("UserUserId");

                    b.ToTable("Comentarii");
                });

            modelBuilder.Entity("Flexident.Data.Lucrare", b =>
                {
                    b.Property<int>("LucrareId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("LucrareId"));

                    b.Property<string>("DescriereLucrare")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("NumeLucrare")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PretLucrare")
                        .HasColumnType("integer");

                    b.HasKey("LucrareId");

                    b.ToTable("Lucrari");
                });

            modelBuilder.Entity("Flexident.Data.LucrareEfectuata", b =>
                {
                    b.Property<int>("LucrareEfectuataId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("LucrareEfectuataId"));

                    b.Property<int>("ComentariuComentariuId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("DataEfectuareLucrare")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("LucrareLucrareId")
                        .HasColumnType("integer");

                    b.Property<int>("PacientPacientId")
                        .HasColumnType("integer");

                    b.HasKey("LucrareEfectuataId");

                    b.HasIndex("ComentariuComentariuId");

                    b.HasIndex("LucrareLucrareId");

                    b.HasIndex("PacientPacientId");

                    b.ToTable("LucrariEfectuate");
                });

            modelBuilder.Entity("Flexident.Data.Pacient", b =>
                {
                    b.Property<int>("PacientId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PacientId"));

                    b.Property<int>("Age")
                        .HasColumnType("integer");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PacientId");

                    b.ToTable("Pacienti");
                });

            modelBuilder.Entity("Flexident.Data.Programare", b =>
                {
                    b.Property<int>("ProgramareId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ProgramareId"));

                    b.Property<string>("DescriereProgramare")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("OraProgramare")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("PacientPacientId")
                        .HasColumnType("integer");

                    b.Property<int>("UserUserId")
                        .HasColumnType("integer");

                    b.HasKey("ProgramareId");

                    b.HasIndex("PacientPacientId");

                    b.HasIndex("UserUserId");

                    b.ToTable("Programari");
                });

            modelBuilder.Entity("Flexident.Data.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("ContActiv")
                        .HasColumnType("boolean");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastLogin")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Specializare")
                        .HasColumnType("integer");

                    b.Property<int>("UserRole")
                        .HasColumnType("integer");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Flexident.Data.Comentariu", b =>
                {
                    b.HasOne("Flexident.Data.User", "User")
                        .WithMany()
                        .HasForeignKey("UserUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Flexident.Data.LucrareEfectuata", b =>
                {
                    b.HasOne("Flexident.Data.Comentariu", "Comentariu")
                        .WithMany()
                        .HasForeignKey("ComentariuComentariuId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Flexident.Data.Lucrare", "Lucrare")
                        .WithMany()
                        .HasForeignKey("LucrareLucrareId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Flexident.Data.Pacient", "Pacient")
                        .WithMany()
                        .HasForeignKey("PacientPacientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Comentariu");

                    b.Navigation("Lucrare");

                    b.Navigation("Pacient");
                });

            modelBuilder.Entity("Flexident.Data.Programare", b =>
                {
                    b.HasOne("Flexident.Data.Pacient", "Pacient")
                        .WithMany()
                        .HasForeignKey("PacientPacientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Flexident.Data.User", "User")
                        .WithMany()
                        .HasForeignKey("UserUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pacient");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
